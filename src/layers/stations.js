import GeoJSON from 'ol/format/GeoJSON.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import Config from '../config';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';

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
function pointStyleFunction(feature, resolution) {
    const stroke = bodyStyles.getPropertyValue('--red-500');
    return new Style({
        image: new CircleStyle({
            radius: 10,
            fill: new Fill({color: 'rgba(255, 0, 0, 0.1)'}),
            stroke: new Stroke({color: stroke, width: 1}),
        }),
        text: createTextStyle(feature, resolution),
    });
}

export const Stations = {
    title: 'Stations',
    visible: false,
    layers: [
        new VectorTileLayer({
            source: new VectorTileSource({
                minZoom: 12,
                maxZoom: 12,
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/stations/list/{z}/{x}/{y}.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
    ],
};
