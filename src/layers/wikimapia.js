import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke, Style} from 'ol/style.js';
import { Config } from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

const bodyStyles = window.getComputedStyle(document.body);

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
// eslint-disable-next-line no-unused-vars
function polylineStyleFunction(feature, resolution) {
  const stroke = bodyStyles.getPropertyValue('--red-500');
  return new Style({
    stroke: new Stroke({
      color: stroke, 
    })
  });
}

export const Wikimapia = {
  id: 'Wm',
  title: 'Wikimapia',
  visible: false,
  layers: [
    new VectorTileLayer({
      minZoom: 13,
      source: new VectorTileSource({
        tileSize: 256,
        minZoom: 13,
        maxZoom: 15,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/wikimapia/polygons/{z}/{x}/{y}.geojson?tileSize=256`,
        format: new GeoJSON(),
      }),
      style: polylineStyleFunction,
    }),
  ],
};
