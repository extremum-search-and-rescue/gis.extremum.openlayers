import Div100vh from "solidjs-div-100vh";
//

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {LayersList} from './layerswitcher/layersmodel';
import LayerControl from './layerswitcher/layercontrol';
import {createStore} from 'solid-js/store';
import {Collection} from 'ol';


import * as Layers from '../layers/index';
import config from '../config';
import '../index.css';
import '../../node_modules/ol/ol.css';
import { onMount } from "solid-js";
console.log('running mapcontainer.jsx');

export const FullScreenMapContainer = props => {
  return <Div100vh>
    <MapContainer id={props.id}></MapContainer>
  </Div100vh>;
}
export const MapContainer = props => {

    const initOpenlayersMap = () => {
        console.log('initializing mapcontainer');
        console.log(props);
        
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
    }
    onMount(()=> initOpenlayersMap());
  return (<div id={props.id}></div>)
}