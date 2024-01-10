import GeoJSON from 'ol/format/GeoJSON.js';
import {Icon, Fill, Stroke, Style, Text} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Config from '../config';
import { toRadians } from 'ol/math';

/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
const createTextStyle = function (feature, resolution) {
  const mapStyles = window.getComputedStyle(document.getElementsByClassName('ol-viewport')[0]);
  const fill = mapStyles.getPropertyValue('--map-text-base');
  const shade = mapStyles.getPropertyValue('--map-inverse');
  const text = resolution > 3 
    ? feature.get('number')
    : `${feature.get('number')} ${feature.get('text')}`;
  return new Text({
    font: 'sans-serif 12px',
    justify: 'left',
    textAlign: 'left',
    text: text,
    fill: new Fill({color: fill}),
    stroke: new Stroke({color: shade, width: 1}),
    offsetX: 12,
    offsetY: 0,
    placement: 'point',
    maxAngle: '45',
    rotation: 0,
  });
};

/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Style}
 */
function pointStyleFunction(feature, resolution) {
  const url = `${Config.frontend.images}/strelka.svg`;
  const degrees = feature.get('degrees');
  const rotation = degrees ? toRadians(degrees) : undefined;
  return new Style({
    image: new Icon({
      src: url,
      rotation: rotation,
      rotateWithView: true,
    }),
    text: resolution<15 ? createTextStyle(feature, resolution) : undefined,
  });
}

export const Strelki = {
  id: 'strA',
  title: 'Стрелки',
  visible: false,
  layers: [
    new VectorLayer({
      minZoom: 5,
      source: new VectorSource({
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/strelki/all.geojson`,
        format: new GeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};
