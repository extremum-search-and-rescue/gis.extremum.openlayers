import './index.css';
import './../node_modules/ol/ol.css';
import { render } from 'solid-js/web';
import * as Layers from './layers/index';
import {FullScreenMapContainer} from './components/fullscreenmap';
import View from 'ol/View.js';
import { Config } from './config';
import { ServiceRegistry } from 'solid-services';
import { Control } from './controls/control';
import { LayerControl } from './controls/layerswitcher/layercontrol';
import Zoom from 'ol/control/Zoom';
import Rotate from 'ol/control/Rotate';
import ScaleLine from 'ol/control/ScaleLine';
import { DrawToolbar } from './controls/draw/drawtoolbar';
import { ControlContainer } from './controls/controlcontainer';
import { Locate } from './controls/geolocation/locate';
import { ContextMenu } from './controls/menu/contextmenu';
import { MainMenu } from './controls/menu/mainmenu';
import { SunmoonCircle } from './controls/suncalc/sunmooncircle';
import { Reticle } from './controls/reticle/reticlecontrol';
import { IpToLocation } from './services/iplocation';
import { Toast } from './controls/messages/toast';
import { Weather } from './controls/weather/weather';

const view = window.View = new View({
  center: Config.center,
  zoom: Config.zoom,
});
IpToLocation.update();

render(() => 
  <ServiceRegistry>
    <FullScreenMapContainer 
      id={'indexMap'} 
      basemaps={[
        Layers.BasicOsm,
        Layers.OpenTopoMap,
        Layers.OpenTopoMapCZ,
        Layers.BingSat,
        Layers.Topomapper,
        Layers.GosGisCenter,
        Layers.EsriSatellite,
        Layers.PkkRosreestr,
        Layers.GoogleSatellite,
        Layers.YandexSatellite,
        Layers.YandexMaps,
        Layers.YandexMapsDark,
        //Layers.MapTilerLayer,
      ]} 
      overlays={[
        Layers.HillshadingCPU,
        Layers.HillshadingGPU,
        Layers.MegafonCoverage,
        Layers.MtsRusCoverage,
        Layers.MtsByCoverage,
        Layers.A1ByCoverage,
        Layers.LifeByCoverage,
        Layers.Tele2Coverage,
        Layers.BeelineCoverage,
        Layers.Strava,
        Layers.OpenSnowMap,
        Layers.Hybrid,
        Layers.GosLesHoz,
        Layers.Strelki,
        Layers.Stations,
        Layers.Wikimapia,
        Layers.YandexRainClouds,
        Layers.LaGrids,
        Layers.ResqueTracks,
        Layers.Photos,
        Layers.MarineTraffic,
        Layers.OpenseamapMarks,
        Layers.OnlineTrackers,
        Layers.GeolocationPublic,
        Layers.LiveTransport
      ]}
      view={view}>
      <Control klass={ContextMenu} classes={'contextmenu gis-mainmenu'} target={'ol-viewport'}/>
      <ControlContainer id={'ol-container-100vh-100vw'}>
        <Control klass={Weather} target={'ol-container-100vh-100vw'}/>
        <Control klass={SunmoonCircle} classes={'suncalc'} target={'ol-container-100vh-100vw'} />
        <Control klass={Reticle} classes={'reticle'} target={'ol-container-100vh-100vw'} />
      </ControlContainer>
      <ControlContainer id={'ol-grid-container'}>
        <Control klass={LayerControl} target={'ol-grid-container'}/>
        <ControlContainer id={'ol-container-1-1'} classes="gis-flex-column" target={'ol-grid-container'}>
          <Control klass={MainMenu} classes={'gis-mainmenu'} target={'ol-container-1-1'}/>
          <Control klass={Zoom} classes={'gis-zoom'} target={'ol-container-1-1'}/>
          <Control klass={Locate} classes={'gis-locate'} target={'ol-container-1-1'}/>
          <Control klass={DrawToolbar} target={'ol-container-1-1'}/>
          <Control klass={Rotate} classes={'gis-rotate'} target={'ol-container-1-1'}/>
        </ControlContainer>
        <Control klass={ScaleLine}/>
      </ControlContainer>
      <ControlContainer id={'toast-overlay'}>
        <Control klass={Toast} classes={'gis-toast'} target={'toast-overlay'}/>
      </ControlContainer>
      <ControlContainer id={'modal-overlay'}/>
    </FullScreenMapContainer>
  </ServiceRegistry>,
document.body
);