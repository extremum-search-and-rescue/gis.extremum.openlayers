//https://a09.layers.extremum.org/v3/trackers/bytile/9/37/18.geojson
import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke as StrokeStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Config from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
function polylineStyleFunction(feature, resolution) {
    console.info(feature);
}

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
                format: new GeoJSON(),
            }),
            style: polylineStyleFunction,
        })]
}