import GeoJSON from 'ol/format/GeoJSON.js';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style.js';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import Config from '../config';
import { toRadians } from 'ol/math';

const bodyStyles = window.getComputedStyle(document.body);
/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
// eslint-disable-next-line no-unused-vars
const createTextStyle = function (feature, resolution) {
  const fill = bodyStyles.getPropertyValue('--red-700');
  return new Text({
    font: 'Arial 12px',
    align: 'left',
    text: feature.get('name'),
    fill: new Fill({color: fill}),
    stroke: new Stroke({color: 'white', width: 1}),
    offsetX: 16,
    offsetY: 0,
    placement: 'Point',
    maxAngle: '45',
    overflow: false,
    rotation: 0,
  });
};

/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Style}
 */
function pointStyleFunction(feature, resolution) {
  const type = feature.get('type');
  return type === undefined ? getContrail(feature) : getPoint(feature, resolution, type);
}
function getPoint(feature, resolution, type) {
  const degrees = feature.get('angle');
  const rotation = degrees ? toRadians(degrees) : undefined;
  return new Style({
    image: new Icon({
      src: `https://gis.extremum.org/images/${type}.png`,
      rotation: type === 'plane' ? rotation : undefined,
      rotateWithView: type ==='plane',
    }),
    text: resolution < 12 ? createTextStyle(feature, resolution) : undefined,
  });
}
// eslint-disable-next-line no-unused-vars
function getContrail(feature) {
  return new Style({
    stroke: new Stroke({
      color: 'rgba(255, 255, 255, 0.4)',
      width: 8
    })
  });
}

export const LiveTransport = {
  id: 'lo',
  title: 'Transport',
  visible: false,
  layers: [
    new VectorTileLayer({
      minZoom: 9,
      source: new VectorTileSource({
        minZoom: 9,
        maxZoom: 9,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/transport/live/{z}/{x}/{y}.geojson?tileSize=256`,
        format: new GeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};
