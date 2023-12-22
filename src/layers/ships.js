import GeoJSON from 'ol/format/GeoJSON.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';

const bodyStyles = window.getComputedStyle(document.body);
/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
const createTextStyle = function (feature, resolution) {
    const fill = bodyStyles.getPropertyValue('--red-700');
    return new Text({
        font: 'Arial 12px',
        align: 'left',
        text: feature.get('text'),
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
function pointStyleFunction(feature, resolution) {
    const stroke = bodyStyles.getPropertyValue('--red-500');
    return new Style({
        image: new CircleStyle({
            radius: 3,
            fill: new Fill({color: 'rgba(255, 0, 0, 0.8)'}),
            stroke: new Stroke({color: stroke, width: 1}),
        }),
        text: createTextStyle(feature, resolution),
    });
}

const MarineTrafficVector = {
    id: 'Mtr',
    title: 'Marine Traffic',
    visible: false,
    layers: [
        new VectorTileLayer({
            source: new VectorTileSource({
                url: `https://tiles.marinetraffic.com/ais_helpers/shiptilesingle.aspx?output=json&sat=1&grouping=shiptype&tile_size=256&legends=1&zoom={z}&X={x}&Y={y}`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
    ],
};

export const MarineTraffic = {
    id: 'Mtr',
    title: 'Marine Traffic',
    visible: false,
    layers: [
        new TileLayer({
            preload: 0,
            tileSize: 256,
            source: new XYZ({
                tileSize: 256,
                url: `https://tiles.marinetraffic.com/ais_helpers/shiptilesingle.aspx?output=png&sat=1&grouping=shiptype&tile_size=256&legends=1&zoom={z}&X={x}&Y={y}`,
            }),
        }),
    ],
};