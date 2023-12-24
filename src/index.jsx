import * as Layers from './layers/index';
import config from './config';
import './index.css';
import './../node_modules/ol/ol.css';
console.log('running index.js');

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {LayersList} from './controls/layerswitcher/layersmodel';
import LayerControl from './controls/layerswitcher/layercontrol';
import {createStore} from 'solid-js/store';
import {Collection} from 'ol';
import { render } from 'solid-js/web';
import { FullScreenMapContainer } from './controls/mapcontainer'

console.log('initializing layers');
const baseMaps = [
    Layers.BasicOsm,
    Layers.OpenTopoMap,
    Layers.OpenTopoMapCZ,
    Layers.OpenSnowMap,
    Layers.BingSat,
    Layers.Topomapper,
    Layers.GosGisCenter,
    Layers.EsriSatellite,
    Layers.PkkRosreestr,
    Layers.GoogleSatellite,
    Layers.YandexSatellite,
    Layers.YandexMaps,
    Layers.YandexMapsDark,
];
const overlayMaps = [
    Layers.MegafonCoverage,
    Layers.MtsRusCoverage,
    Layers.MtsByCoverage,
    Layers.A1ByCoverage,
    Layers.LifeByCoverage,
    Layers.Tele2Coverage,
    Layers.BeelineCoverage,
    Layers.YandexTracks,
    Layers.Strava,
    Layers.Hybrid,
    Layers.GosLesHoz,
    Layers.Strelki,
    Layers.Stations,
    Layers.Wikimapia,
    Layers.LaGrids,
    Layers.ResqueTracks,
    Layers.Photos,
    Layers.MarineTraffic,
    Layers.OpenseamapMarks,
    Layers.OnlineTrackers,
    Layers.Hillshading,
    Layers.GeolocationPublic,
    Layers.LiveTransport
];

console.log('initialized layers');

const [basemaps, setBasemaps] = createStore(baseMaps);
const [overlays, setOverlays] = createStore(overlayMaps);

const layersToAdd = baseMaps
    .flatMap((b) => b.layers.map((l) => Object.assign(l, {id: b.id, type: 'base', visible: b.visible || false})))
    .concat(overlayMaps.flatMap((o) => o.layers.map((l) => Object.assign(l, {id: o.id, visible: o.visible || false}))));
layersToAdd.forEach((l) => l.setVisible(l.visible));


render(() => <FullScreenMapContainer id={"indexMap"}/>, document.body);

const indexMap = new Map({
    controls: new Collection(),
    layers: layersToAdd,
    target: 'indexMap',
    view: new View({
        center: config.center,
        zoom: config.zoom,
    }),
});

var layersModel = new LayersList(indexMap, basemaps, setBasemaps, overlays, setOverlays);

indexMap.addControl(new LayerControl(layersModel));

console.log('created map');