import GeoJSON from 'ol/format/GeoJSON.js';
import {Stroke as StrokeStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Config from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

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
        })
    });
}

export const ResqueTracks = {
    id: 'aT',
    title: 'Search tracks',
    visible: false,
    layers: [
        new TileLayer({
            minZoom: 7,
            maxZoom: 13,
            preload: 0,
            source: new XYZ({
                transition: 0,
                minZoom: 7,
                maxZoom: 13,
                tileSize: 256,
                url: `${Config.backend.scheme}://${Config.backend.host}/v2/selector/tracks/{z}/{x}/{y}.png?layers=Extremum/LizaAlert/Otklik/Other/Yarspas&tileSize=256`
                }),
            }),
        new VectorTileLayer({
            minZoom: 13,
            preload: 0,
            source: new VectorTileSource({
                transition: 0,
                minZoom: 13,
                maxZoom: 13,
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/selector/tracks/{z}/{x}/{y}.geojson?layers=Extremum/LizaAlert/Otklik/Other/Yarspas&tileSize=256`,
                format: new GeoJSON(),
            }),
            style: polylineStyleFunction,
        }),
    ],
};