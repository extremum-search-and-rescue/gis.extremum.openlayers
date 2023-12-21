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
    const da = feature.get('dashArray');
    return new Style({
        stroke: new Stroke({
            color: feature.get('color'), 
            width: feature.get('weight'),
            lineDash: da != null ? da.split(' ') : undefined,
            lineCap: 'butt'
        })
    });
}

export const WaysLayer = new VectorTileLayer({
            source: new VectorTileSource({
                minZoom: 13,
                maxZoom: 13,
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/osmhybrid/ways/{z}/{x}/{y}.geojson?tileSize=256`,
                format: new GeoJSON(),
            }),
            style: polylineStyleFunction,
        })
