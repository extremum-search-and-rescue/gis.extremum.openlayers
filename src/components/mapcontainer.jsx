import Map from 'ol/Map.js';
import {Collection} from 'ol';
import '../index.css';
import '../../node_modules/ol/ol.css';
import { onMount } from 'solid-js';
import { useService } from 'solid-services';
import {GPX} from 'ol/format.js';
import { MapContext } from '../services/mapcontext';
import { LayerService } from '../services/layerservice';
import { defaults } from 'ol/interaction/defaults';
import ArrayGeoJSON from '../format/ArrayGeoJSON';
import PLT from '../format/PLT';
import DragAndDrop from 'ol/interaction/DragAndDrop';

console.log('running mapcontainer.jsx');

export const MapContainer = props => {
  // eslint-disable-next-line solid/reactivity
  if(!props.id) throw new Error('no map div id in props');
  // eslint-disable-next-line solid/reactivity
  if(!props.view) throw new Error('no View in props');

  onMount(() => {
        
    console.log('initializing mapcontainer');
    console.log(props);
    const layerService = useService(LayerService);

    layerService().basemaps = props.basemaps;
    layerService().overlays = props.overlays;
        
    const interactions = props.interactions || defaults();

    const indexMap = new Map({
      controls: props.controls || new Collection(),
      interactions: interactions,
      layers: layerService().flat,
      target: props.id,
      view: props.view,
    });


    let dragAndDropInteraction;

    function setInteraction() {
      if (dragAndDropInteraction) {
        indexMap.removeInteraction(dragAndDropInteraction);
      }
      dragAndDropInteraction = new DragAndDrop({
        formatConstructors: [
          GPX,
          ArrayGeoJSON,
          PLT
        ],
      });
      dragAndDropInteraction.on('addfeatures', (event)=> layerService().addFeatures(event, indexMap));
      indexMap.addInteraction(dragAndDropInteraction);
    }
    setInteraction();

    const getMap = useService(MapContext);
    getMap().map = indexMap;
  });

  return (<div id={props.id}>
    {props.children}
  </div>);
};