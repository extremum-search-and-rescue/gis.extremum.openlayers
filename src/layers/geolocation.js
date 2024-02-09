import ArrayGeoJSON from '../format/ArrayGeoJSON';
import {Icon, Fill, Stroke, Style, Text} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Config from '../config';

setInterval(function(){
  if(GeolocationPublic && GeolocationPublic.layers && GeolocationPublic.layers.find(f => f.getVisible())) {
    GeolocationPublic.layers.forEach(l => l.getSource().refresh());
  }
  if(GeolocationExtremum && GeolocationExtremum.layers && GeolocationExtremum.layers.find(f => f.getVisible())) {
    GeolocationExtremum.layers.forEach(l => l.getSource().refresh());
  }
  if(GeolocationLizaAlert && GeolocationLizaAlert.layers && GeolocationLizaAlert.layers.find(f => f.getVisible())) {
    GeolocationLizaAlert.layers.forEach(l => l.getSource().refresh());
  }
}, 10000);

let bodyStyles = window.getComputedStyle(document.body);
let mapstyles = false;
/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
// eslint-disable-next-line no-unused-vars
const createTextStyle = function (feature, resolution) {
  if(!mapstyles) {
    const viewports = document.getElementsByClassName('ol-viewport');
    if(viewports && viewports.length > 0) {
      bodyStyles = window.getComputedStyle(viewports[0]);
      mapstyles = true;
    }
  }
  const fill = bodyStyles.getPropertyValue('--map-text-base');
  const outline = bodyStyles.getPropertyValue('--map-inverse');
  const acc = feature.get('acc');
  const formattedText = `${feature.get('deviceName')}${acc ? `± ${acc}` : ''}`;
  return new Text({
    font: 'Arial 12px',
    align: 'left',
    text: formattedText,
    fill: new Fill({color: fill}),
    stroke: new Stroke({color: outline, width: 1}),
    offsetX: 8,
    offsetY: 0,
    placement: 'Point',
    maxAngle: '45',
    overflow: true,
    rotation: 0,
  });
};

/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Style}
 */
function pointStyleFunction(feature, resolution) {
  const isLast = feature.get('isLast');
  return new Style({
    image: new Icon({
      src: `${Config.frontend.images}/${isLast ? 'last' : 'other' }.svg` 
    }),
    text: resolution < 12 && isLast ? createTextStyle(feature, resolution) : undefined,
  });
}

export const GeolocationPublic = {
  id: 'gEp',
  title: 'Geolocation (public)',
  visible: false,
  layers: [
    new VectorLayer({
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/geo.extremum.org.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    }),
    new VectorLayer({
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/gps.extremum.org.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};

export const GeolocationExtremum = {
  id: 'gE',
  title: 'Geolocation (Extremum)',
  visible: false,
  layers: [
    new VectorLayer({
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/extremum.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    })
  ],
};

export const GeolocationLizaAlert = {
  id: 'gLa',
  title: 'Geolocation (LizaAlert)',
  visible: false,
  layers: [
    new VectorLayer({
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/lizaalert.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    }),
    new VectorLayer({
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/lizaalert.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};