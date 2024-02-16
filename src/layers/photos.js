import GeoJSON from 'ol/format/GeoJSON.js';
import {Fill, Stroke, Style, Text, Icon} from 'ol/style.js';
import { Config } from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

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
// eslint-disable-next-line no-unused-vars
function pointStyleFunction(feature, resolution) {
  const thumbSize = window.devicePixelRatio <= 1 ? 24 : 48;
  return new Style({
    image: new Icon({
      src: `${Config.backend.scheme}://${Config.backend.host}/photo/thumbnails/${thumbSize}/${feature.get('hash')}.png`,
      //size: thumbSize
    }),
    //  text: createTextStyle(feature, resolution),
  });
}

export const Photos = {
  id: 'PH',
  title: 'Photos',
  visible: false,
  layers: [
    new VectorTileLayer({
      minZoom: 13,
      source: new VectorTileSource({
        minZoom: 13,
        maxZoom: 13,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/photo/photos/{z}/{x}/{y}.geojson?tileSize=256`,
        format: new GeoJSON(),
      }),
      style: pointStyleFunction,
    }),
  ],
};
