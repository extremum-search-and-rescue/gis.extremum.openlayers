import Control from 'ol/control/Control'
import {LayersModel } from './layersmodel'
import { For, createComponent } from 'solid-js';
import './layercontrol.css'



/**
* @type {{
* props: @type {{}}
* }}
*/
const LayerControlComponent = props => {
    console.warn('adding LayerControlComponent')
    return (<div class={props.classes}>
      <div class="set">
      <For each={props.basemaps}>
        { (item) => <label><input type="radio" checked={item.get('visible')} name="basemaps"></input>{item.get('title')}</label>}
      </For>
      </div>
      <div class="set">
      <For each={props.overlays}>
        { (item) =><label><input type="checkbox" checked={item.get('visible')} ></input>{item.get('title')}</label>}
      </For>
      </div>
    </div>)
}

class LayerControl extends Control
{
      /**
   * @param {Object} [opt_options] Control options.
   */
  constructor(opt_options) {
    console.warn('adding LayerControl')

    const options = opt_options || {};
    console.warn(opt_options.basemaps);
    const props = { 
      classes: "ol-unselectable gis-layercontrol",
      basemaps: opt_options.basemaps,
      overlays: opt_options.overlays
    };
    
    const element = createComponent(LayerControlComponent, props);
    
    super({
      element: element,
      target: options.target,
    });
  }
}

export default LayerControl