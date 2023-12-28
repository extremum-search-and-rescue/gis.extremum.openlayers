import './index.css';
import './../node_modules/ol/ol.css';
import { render } from 'solid-js/web';
import * as Layers from './layers/index';
import {FullScreenMapContainer} from './components/fullscreenmap'
import View from 'ol/View.js';
import config from './config';
import { ServiceRegistry } from 'solid-services';
import { Control } from './controls/control';
import LayerControl from './controls/layerswitcher/layercontrol';
import Zoom from 'ol/control/Zoom'
import Rotate from 'ol/control/Rotate'
import ScaleLine from 'ol/control/ScaleLine'
import { DrawToolbar } from './controls/draw/drawtoolbar';
import { ControlContainer } from './controls/controlcontainer';
import { Locate } from './controls/geolocation/locate';

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
    Layers.Hillshading,
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
    Layers.GeolocationPublic,
    Layers.LiveTransport
];

console.log('initialized layers');
const view = new View({
    center: config.center,
    zoom: config.zoom,
})

render(() => 
    <ServiceRegistry>
        <FullScreenMapContainer 
            id={"indexMap"} 
            basemaps={baseMaps} 
            overlays={overlayMaps}
            view={view}>
            <Control klass={LayerControl}/>
            <ControlContainer id={'ol-container-1-1'} classes="gis-flex-column">
                <Control klass={Zoom} classes={'gis-zoom'} target={'ol-container-1-1'}/>
                <Control klass={DrawToolbar} target={'ol-container-1-1'}/>
                <Control klass={Rotate} classes={'gis-rotate'} target={'ol-container-1-1'}/>
                <Control klass={Locate} classes={'gis-locate'} target={'ol-container-1-1'}/>
            </ControlContainer>
            <Control klass={ScaleLine}/>
        </FullScreenMapContainer>
    </ServiceRegistry>,
    document.body
    );

console.log('created map');
