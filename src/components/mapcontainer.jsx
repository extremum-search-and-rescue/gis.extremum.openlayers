import Map from 'ol/Map.js';
import LayerControl from '../controls/layerswitcher/layercontrol';
import {Collection} from 'ol';
import '../index.css';
import '../../node_modules/ol/ol.css';
import { onMount } from "solid-js";
import { useService } from 'solid-services';
import { MapContext } from '../services/mapcontext';
import { LayerService } from '../services/layerservice';
import { Control } from '../controls/control';

console.log('running mapcontainer.jsx');

export const MapContainer = props => {
    if(!props.id) throw new Error("no map div id in props");
    if(!props.view) throw new Error("no View in props");

    onMount(() => {
        
        console.log('initializing mapcontainer');
        console.log(props);
        const layerService = useService(LayerService)

        layerService().basemaps = props.basemaps;
        layerService().overlays = props.overlays;
        
        const getMap = useService(MapContext);
        const indexMap = new Map({
            controls: new Collection(),
            layers: layerService().flat,
            target: props.id,
            view: props.view,
        });
        getMap().map = indexMap;

    });
  return (<div id={props.id}>
    <Control klass={LayerControl}/>
  </div>)
}