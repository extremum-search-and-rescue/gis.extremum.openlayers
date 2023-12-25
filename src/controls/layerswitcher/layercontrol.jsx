import Control from 'ol/control/Control';
import {LayersList} from './layersmodel';
import {For, Index, Show, createComponent} from 'solid-js';
import './layercontrol.css';
import './../checkbox.css'
import './../radiogroup.css'
import { Checkbox} from '@ark-ui/solid'
import { RadioGroup } from '@ark-ui/solid';

const BaseMapSelector = (params) => {
    console.info('adding BaseMapSelector', params);
    return (
        <div class="set">
        <RadioGroup.Root value={params.model.get('basemaps').filter(b => b.visible)[0].id} 
            onValueChange={(i) => params.model.changeBasemap(i.value)}>
            <Index each={params.model.get('basemaps')}>
                {(item) =>
                    <RadioGroup.Item value={item().id} checked={item().visible}>
                        <RadioGroup.ItemControl/>
                        <RadioGroup.ItemText>{item().title}</RadioGroup.ItemText>
                    </RadioGroup.Item>
                }
            </Index>
        </RadioGroup.Root>
        </div>
    );
};

const OverlayItem = (params) => {
    return (
        <Checkbox.Root checked={params.item.visible} onCheckedChange={(ev)=> params.model.toggleOverlay(params.item.id, ev.checked) }>
            <Checkbox.Control/>
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
