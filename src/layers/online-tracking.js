import { ArrayGeoJSON } from '../format/ArrayGeoJSON';
import {Stroke, Style} from 'ol/style.js';
import { Config } from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

setInterval(function(){
  if(OnlineTrackers && OnlineTrackers.layers && OnlineTrackers.layers.find(f => f.getVisible())) {
    OnlineTrackers.layers.forEach(l => l.getSource().refresh());
  }
}, 15000);

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
// eslint-disable-next-line no-unused-vars
function featureStyleFunction(feature, resolution) {
  
}

// eslint-disable-next-line no-unused-vars
function LineStyle(feature) {
  return new Style({
    stroke: new Stroke({
      color: feature.get('color'), 
      width: feature.get('weight'),
    })
  });
}

export const OnlineTrackers = {
  id: 'tb',
  title: 'Online tracking',
  visible: false,
  layers: [
    new VectorTileLayer({
      minZoom: 9,
      preload: 0,
      source: new VectorTileSource({
        transition: 0,
        minZoom: 9,
        maxZoom: 9,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/trackers/bytile/{z}/{x}/{y}.geojson?tileSize=256`,
        format: new ArrayGeoJSON(),
      }),
      style: featureStyleFunction,
    })]
};