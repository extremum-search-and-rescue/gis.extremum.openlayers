import GeoJSON from 'ol/format/GeoJSON.js';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Config from '../config';

const bodyStyles = window.getComputedStyle(document.body);
/**
 * @param {GeoJSON.Point} feature
 * @param {number} resolution
 * @returns {Text}
 */
const createTextStyle = function (feature, resolution) {
    const fill = bodyStyles.getPropertyValue('--red-700');
    const formattedText = `${feature.get('deviceName')} ± ${acc}`;
    return new Text({
        font: 'Arial 12px',
        align: 'left',
        text: formattedText,
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

export const GeolocationPublic = {
    id: 'gEp',
    title: 'Geolocation (public)',
    visible: false,
    layers: [
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/geo.extremum.org.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/gps.extremum.org.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
    ],
};

export const GeolocationExtremum = {
    id: 'gE',
    title: 'Geolocation (Extremum)',
    visible: false,
    layers: [
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/extremum.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        })
    ],
};

export const GeolocationLizaAlert = {
    id: 'gLa',
    title: 'Geolocation (LizaAlert)',
    visible: false,
    layers: [
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/lizaalert.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/lizaalert.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        }),
    ],
};

export const GeolocationYarspas = {
    id: 'gYs',
    title: 'Geolocation (Yarspas)',
    visible: false,
    layers: [
        new VectorLayer({
            source: new VectorSource({
                url: `${Config.backend.scheme}://${Config.backend.host}/v3/geolocation/yarspas.geojson`,
                format: new GeoJSON(),
            }),
            style: pointStyleFunction,
        })
    ],
};