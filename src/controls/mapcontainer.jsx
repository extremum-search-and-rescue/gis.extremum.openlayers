import Map from 'ol/Map.js';
import {LayersList} from './layerswitcher/layersmodel';
import LayerControl from './layerswitcher/layercontrol';
import {createStore} from 'solid-js/store';
import {Collection} from 'ol';
import '../index.css';
import '../../node_modules/ol/ol.css';
import { onMount } from "solid-js";

console.log('running mapcontainer.jsx');

export const MapContainer = props => {

    onMount(() => {
        console.log('initializing mapcontainer');
        console.log(props);

        const [basemaps, setBasemaps] = createStore(props.basemaps);
        const [overlays, setOverlays] = createStore(props.overlays);

        const layersToAdd = props.basemaps
            .flatMap((b) => b.layers.map((l) => Object.assign(l, {id: b.id, type: 'base', visible: b.visible || false})))
            .concat(props.overlays.flatMap((o) => o.layers.map((l) => Object.assign(l, {id: o.id, visible: o.visible || false}))));

        layersToAdd.forEach((l) => l.setVisible(l.visible));
        
        const indexMap = new Map({
            controls: new Collection(),
            layers: layersToAdd,
            target: props.id,
            view: props.view,
        });

    var layersModel = new LayersList(indexMap, basemaps, setBasemaps, overlays, setOverlays);

    indexMap.addControl(new LayerControl(layersModel));

    });
  return (<div id={props.id}></div>)
}