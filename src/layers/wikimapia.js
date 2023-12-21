import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke as StrokeStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Config from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

const bodyStyles = window.getComputedStyle(document.body);

/**
 * @param {GeoJSON.MultiLineString} feature
 * @param {number} resolution
 * @returns {Style}
 */
function polylineStyleFunction(feature, resolution) {
    const stroke = bodyStyles.getPropertyValue('--red-500');
    return new Style({
        stroke: new Stroke({
            color: stroke, 
        })
    });
}

export const Wikimapia = {
    id: 'wm',
    title: 'Wikimapia',
    visible: false,
    layers: [
        new VectorTileLayer({
            source: new VectorTileSource({
                minZoom: 13,
                maxZoom: 15,
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/wikimapia/polygons/{z}/{x}/{y}.geojson?tileSize=256`,
                format: new GeoJSON(),
            }),
            style: polylineStyleFunction,
        }),
    ],
};
