import Control from 'ol/control/Control';
import {LayersList, LayersModel} from './layersmodel';
import {For, createComponent} from 'solid-js';
import './layercontrol.css';

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
                    <BasemapItem id={item.id} item={item} onchange={(ev)=> params.model.changeBasemap(item.id)} />
                }
            </For>
        </div>
    );
};

const OverlayItem = (params) => {
    return (
        <label>
            <input type="checkbox" checked={params.item.visible} onchange={params.onchange}/>
            {params.item.title}
        </label>
    );
};

const OverlaySelector = (params) => {
    console.info('adding OverlaySelector', params);

    return (
        <div class="set">
            <For each={params.model.get('overlays')}>
                { (item) => 
                    <OverlayItem id={item.id} item={item} onchange={(ev)=> params.model.toggleOverlay(item.id, ev.srcElement.checked )}/>
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
            element: element,
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
