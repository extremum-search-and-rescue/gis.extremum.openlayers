import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke, Style} from 'ol/style.js';
import Config from '../config';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

const bodyStyles = window.getComputedStyle(document.body);

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
function polylineStyleFunction() {
  const stroke = bodyStyles.getPropertyValue('--red-500');
  return new Style({
    stroke: new Stroke({
      color: stroke, 
    })
  });
}

export const LaGrids = {
  id: 'lg',
  title: 'Grids',
  visible: false,
  layers: [
    new VectorLayer({
      source: new VectorSource({
        minZoom: 13,
        maxZoom: 15,
        url: `${Config.backend.scheme}://${Config.backend.host}/v3/lagrid/all.geojson`,
        format: new GeoJSON(),
      }),
      style: polylineStyleFunction,
    }),
  ],
};
