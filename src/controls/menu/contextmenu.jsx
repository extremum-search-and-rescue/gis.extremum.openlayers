import { Menu } from '@ark-ui/solid';
import Control from 'ol/control/Control';
import { stopPropagation } from 'ol/events/Event';
import {createComponent, createSignal, onMount, For } from 'solid-js';
import { useService } from 'solid-services';
import { MapContext } from '../../services/mapcontext';
import { toLonLat } from 'ol/proj';
import {CoordinateConverter} from './../../utils/coordinates';

const ContextMenuComponent = () => {
  let trigger;
  const [cursorCoord, setCursorCoord] = createSignal([0,0]);
  const [cursorFeatures, setCursorFeatures] = createSignal([]);
  let pixel;
  const mapContext = useService(MapContext);

  function onContextMenu(event){
    if(!event.isTrusted) {
      return;
    }
    const clone = new event.constructor(event.type, event);
    if(event.type.startsWith('context')){
      event.preventDefault();
      stopPropagation(event);
    } 
    pixel = [clone.x, clone.y];
    trigger.dispatchEvent(clone);
  }
  function onOpenChange(details){
    if(!details.open)  {
      setCursorFeatures([]);
      return;
    }
    const map = mapContext().map();
    setCursorCoord(toLonLat(map.getCoordinateFromPixel(pixel)));
    const features = [];
    map.forEachFeatureAtPixel(pixel, (feature) => {
      features.push(feature);
    });
    setCursorFeatures(features);
  }
  onMount( () => {
    const viewport = document.getElementsByClassName('ol-layers')[0];
    viewport.addEventListener('contextmenu', onContextMenu, {}, true);
    
    //workaround on touch, at least on iOS
    viewport.addEventListener('pointerdown', onContextMenu);
    viewport.addEventListener('pointermove', onContextMenu);
    viewport.addEventListener('pointerup', onContextMenu);
    //end of workaround
  });
  return (
    <div>
      <Menu.Root class={'gis-mainmenu'} onOpenChange={onOpenChange}>
        <Menu.ContextTrigger asChild>
          <div ref={trigger} style={{
            'pointer-events': 'none',
            '-webkit-touch-callout': 'none',
            width: '100vw',
            height: '100vh'
          }} />
        </Menu.ContextTrigger>
        <Menu.Positioner>
          <Menu.Content class={'gis-mainmenu'}>
            <Menu.Item id='ctx_new_marker'>Create marker</Menu.Item>
            <Menu.Separator/>
            <Menu>
              <Menu.TriggerItem class={'gis-mainmenu'}>
                Copy to clipboard
              </Menu.TriggerItem>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item id='ctx_copy_link'>Link</Menu.Item>
                  <Menu.Item id='ctx_copy_dd'>{CoordinateConverter.formatLonLat(cursorCoord(), CoordinateConverter.SIGNED_DEGREES)}</Menu.Item>
                  <Menu.Item id='ctx_copy_dmm'>{CoordinateConverter.formatLonLat(cursorCoord(), CoordinateConverter.DEGREES_AND_MINUTES)}</Menu.Item>
                  <Menu.Item id='ctx_copy_dms'>{CoordinateConverter.formatLonLat(cursorCoord(), CoordinateConverter.DEGREES_AND_MINUTES_AND_SECONDS)}</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu>
            <Menu>
              <Menu.TriggerItem class={'gis-mainmenu'}>
                Select
              </Menu.TriggerItem>
              <Menu.Positioner>
                <Menu.Content>
                  <For each={cursorFeatures()}>
                    {(item)=> 
                      <Menu.Item id='ctx_copy_link'>{item.get('text') || item.get('name') || item.get('description')}</Menu.Item>
                    }
                  </For>
                </Menu.Content>
              </Menu.Positioner>
            </Menu>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  );
};

export class ContextMenu extends Control {
  static element;
  constructor(options) {
    options = options || {};     
    const element = createComponent(ContextMenuComponent);
    
    super({
      element: element(),
      target: options.target || undefined,
    });
  }
  setMap(map){
    super.setMap(map);
    this._map = map;
  }
}