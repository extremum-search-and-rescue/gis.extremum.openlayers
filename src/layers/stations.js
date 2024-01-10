import {Icon, Fill, Stroke, Style, Text} from 'ol/style.js';
import Config from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import ArrayGeoJSON from '../format/ArrayGeoJSON';

const bodyStyles = window.getComputedStyle(document.body);
/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
// eslint-disable-next-line no-unused-vars
const createTextStyle = function (feature, resolution) {
  const fill = bodyStyles.getPropertyValue('--gray-950');
  return new Text({
    font: 'Arial 12px',
    justify: 'left',
    textAlign: 'left',
    text: feature.get('name'),
    fill: new Fill({color: fill}),
    stroke: new Stroke({color: 'white', width: 1}),
    offsetX: 16,
    offsetY: 0,
    placement: 'point',
    maxAngle: '45',
  });
};

/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Style}
 */
function pointStyleFunction(feature, resolution) {
  return new Style({
    image: new Icon({
      src: `${Config.frontend.images}/${feature.get('type')}.svg`
    }),
    text: resolution < 8 
      ? createTextStyle(feature, resolution)
      : undefined
  });
}

export const Stations = {
  title: 'Stations',
  visible: false,
  layers: [
    new VectorTileLayer({
      minZoom: 12,
      source: new VectorTileSource({
        minZoom: 12,
        maxZoom: 12,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/stations/list/{z}/{x}/{y}.geojson`,
        format: new ArrayGeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};
