/* eslint-disable solid/reactivity */
import Map from 'ol/Map.js';
import {Collection} from 'ol';
import '../index.css';
import '../../node_modules/ol/ol.css';
import { createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useService } from 'solid-services';
import {GPX} from 'ol/format.js';
import { MapContext } from '../services/mapcontext';
import { LayerService } from '../services/layerservice';
import { defaults } from 'ol/interaction/defaults';
import { ArrayGeoJSON } from '../format/ArrayGeoJSON';
import { PLT } from '../format/PLT';
import DragAndDrop from 'ol/interaction/DragAndDrop';
import { GisLink } from '../interactions/link';

function MapInternal(props) {
  const layerService = useService(LayerService);

  layerService().basemaps = props.basemaps;
  layerService().overlays = props.overlays;
        
  const interactions = props.interactions || defaults();

  const options = {...{
    controls: props.controls || new Collection(),
    interactions: interactions,
    layers: layerService().flat,
    target: props.target(),
    view: props.view,
    maxTilesLoading: 64,
    moveTolerance: 1 //default value
  }, ...props.options};
    
  const indexMap = new Map(options);

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
}


export const MapContainer = props => {
  if(!props.id) throw new Error('no map div id in props');
  if(!props.view) throw new Error('no View in props');

  let [mapDiv, setMapDiv] = createSignal(null);

  return (<div id={props.id} ref={(el) => setMapDiv(el) } class='map-default'>
    <MapInternal target={mapDiv} {...props}/>
    <For each={props.children}>
      {
        (item) => {
          return <Dynamic parent={mapDiv} component={item} />;
        }
      }
    </For>
  </div>);
};