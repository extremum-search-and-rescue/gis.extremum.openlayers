import './index.css';
import './../node_modules/ol/ol.css';
import { render } from 'solid-js/web';
import * as Layers from './layers/index';
import {FullScreenMapContainer} from './components/fullscreenmap'
import View from 'ol/View.js';
import config from './config';

console.log('running index.js');

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
const view = new View({
    center: config.center,
    zoom: config.zoom,
})

render(() => <FullScreenMapContainer 
    id={"indexMap"} 
    basemaps={baseMaps} 
    overlays={overlayMaps}
    view={view}
    />,
    document.body
    );

console.log('created map');
