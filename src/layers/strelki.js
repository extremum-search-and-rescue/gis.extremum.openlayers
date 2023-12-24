import GeoJSON from 'ol/format/GeoJSON.js';
import {Icon, Fill, Stroke, Style, Text} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Config from '../config';
import { toRadians } from 'ol/math'

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
        text: feature.get('number'),
        fill: new Fill({color: fill}),
        stroke: new Stroke({color: 'white', width: 1}),
        offsetX: 16,
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
    const url = `${Config.frontend.images}/strelka.svg`;
    const degrees = feature.get('degrees')
    const rotation = degrees ? toRadians(degrees) : undefined;
    if(feature.get('number')=='88') {
        console.info(feature); 
        console.info(rotation)
    }
    return new Style({
        image: new Icon({
            src: url,
            rotation: rotation
        }),
        text: resolution<15 ? createTextStyle(feature, resolution) : undefined,
    });
}

export const Strelki = {
    id: 'strA',
    title: 'Стрелки',
    visible: false,
    layers: [
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/strelki/all.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
    ],
};
