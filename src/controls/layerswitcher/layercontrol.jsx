import Control from 'ol/control/Control';
import {LayersList} from './layersmodel';
import {For, Show, createComponent} from 'solid-js';
import './layercontrol.css';
import './../checkbox.css'
import { Checkbox} from '@ark-ui/solid'
import { createSignal } from 'solid-js'
import { Checkmark } from '../checkmark';

const BasemapItem = (params) => {
    return (
        <label>
            <input type="radio" data-id={params.id} checked={params.item.visible} onchange={params.onchange} name="basemaps"/>
            {params.item.title}
        </label>
    );
};

const BaseMapSelector = (params) => {
    console.info('adding BaseMapSelector', params);
    return (
        <div class="set">
            <For each={params.model.get('basemaps')}>
                { (item) => 
                    <BasemapItem id={item.id} item={item} model={params.model} onchange={()=> params.model.changeBasemap(item.id)} />
                }
            </For>
        </div>
    );
};

const OverlayItem = (params) => {
    const [checked, setChecked] = createSignal(params.item.visible)
    console.info(params);
    return (
        <Checkbox.Root checked={params.item.visible} onCheckedChange={(ev)=> params.model.toggleOverlay(params.item.id, ev.checked) }>
            <Checkbox.Control>
                <Show when={params.item.visible}><Checkmark/></Show>
            </Checkbox.Control>
            <Checkbox.Label>{params.item.title}</Checkbox.Label>
      </Checkbox.Root>
    );
};

const OverlaySelector = (params) => {
    console.info('adding OverlaySelector', params);

    return (
        <div class="set">
            <For each={params.model.get('overlays')}>
                { (item) => 
                    <OverlayItem id={item.id} model={params.model} item={item}/>
                }
            </For>
        </div>
    );
};

const LayerControlComponent = (params) => {
    console.info('adding LayerControlComponent', params);
    return (
        <div class={params.classes}>
            <BaseMapSelector model={params.model}/>
            <OverlaySelector model={params.model}/>
        </div>
    );
};

class LayerControl extends Control {
    /**
     * @param {LayersList} [layersModel]
     */

    constructor(layersModel) {
        console.info('LayerControl constructor');
        const params = {
            classes: 'ol-unselectable gis-layercontrol',
            model: layersModel,
        };
        console.info('adding LayerControl', params);
        const element = createComponent(LayerControlComponent, params);

        super({
            element: element(),
            target: undefined,
        });
        this.layersModel = layersModel;
    }
    setMap(map){
        super.setMap(map);
        this._map = map;
    }
}

export default LayerControl;
