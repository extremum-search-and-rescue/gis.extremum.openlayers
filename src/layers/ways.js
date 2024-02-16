import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke, Style} from 'ol/style.js';
import { Config } from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
// eslint-disable-next-line no-unused-vars
function polylineStyleFunction(feature, resolution) {
  const mapStyles = window.getComputedStyle(document.getElementsByClassName('ol-viewport')[0]);
  let color = feature.get('color');
  if(color == '#A9A9A9') color = mapStyles.getPropertyValue('--map-line-base');
  const da = feature.get('dashArray');
  return new Style({
    stroke: new Stroke({
      color: color, 
      width: feature.get('weight'),
      lineDash: da != null ? da.split(' ') : undefined,
      lineCap: 'butt'
    })
  });
}

export const WaysLayer = new VectorTileLayer({
  minZoom: 13,
  source: new VectorTileSource({
    minZoom: 13,
    maxZoom: 13,
    url: `${Config.backend.scheme}://${Config.backend.host}/v3/osmhybrid/ways/{z}/{x}/{y}.geojson?tileSize=256`,
    format: new GeoJSON(),
  }),
  style: polylineStyleFunction,
});
