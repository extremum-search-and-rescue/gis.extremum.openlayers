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
import { ArrayGeoJSON } from '../format/ArrayGeoJSON';
import { PLT } from '../format/PLT';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import { GisLink } from '../interactions/link';

export const MapContainer = props => {
  // eslint-disable-next-line solid/reactivity
  if(!props.id) throw new Error('no map div id in props');
  // eslint-disable-next-line solid/reactivity
  if(!props.view) throw new Error('no View in props');

  let mapDiv;
  onMount(() => {
    const layerService = useService(LayerService);

    layerService().basemaps = props.basemaps;
    layerService().overlays = props.overlays;
        
    const interactions = props.interactions || defaults();

    const indexMap = new Map({
      controls: props.controls || new Collection(),
      interactions: interactions,
      layers: layerService().flat,
      target: mapDiv,
      view: props.view,
      maxTilesLoading: 64,
      moveTolerance: 1 //default value
    });


    let dragAndDropInteraction;

    function setDragDropInteraction() {
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
      dragAndDropInteraction.on('addfeatures', (event)=> layerService().addFeaturesFromEvent(event, indexMap));
      indexMap.addInteraction(dragAndDropInteraction);
    }
    setDragDropInteraction();
    indexMap.addInteraction(new GisLink());

    const getMap = useService(MapContext);
    getMap().map = indexMap;
  });

  return (<div id={props.id} ref={(el) => mapDiv = el } class='map-default'>
    {props.children}
  </div>);
};