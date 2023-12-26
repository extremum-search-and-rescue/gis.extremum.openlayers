import { createComponent } from "solid-js";
import Control from 'ol/control/Control'
import { createStore } from "solid-js/store";
import './drawtoolbar.css'
import { useService } from "solid-services";
import { LayerService } from "../../services/layerservice";
import Draw from 'ol/interaction/Draw'

const DrawToolbarComponent = props => {
    console.log('drawing buttons')
    return (
        <div class={props.classes}>
            <For each={props.buttons}>
            {(item) => 
                <button onClick={() => props.interaction(item.type)}>{item.name}</button>
            }
            </For>
            {props.children}
        </div>
    )
}

export class DrawToolbar extends Control {
    constructor(options, children) {  
        const getLayers = useService(LayerService);        
        let draw;

        const [buttons, setButtons] = createStore([
            {
                name: 'Point',
                type: 'Point',
                toggled: false
            },
            {
                name: 'Line',
                type: 'LineString',
                toggled: false
            },
            {
                name: 'Polygon',
                type: 'Polygon',
                toggled: false
            },
            {
                name: 'Circle',
                type: 'Circle',
                toggled: false
            },
        ]);
        
        const params = {
            classes: 'gis-control-toolbar gis-drawtoolbar ol-unselectable',
            buttons: buttons,
            interaction: (type) => {
                const drawLayer = getLayers().userDrawingLayer;

                if(draw) {
                    this._map.removeInteraction(draw);
                } 
                draw = new Draw({
                    source: drawLayer,
                    type: type,
                });
                this._map.addInteraction(draw);
            },
            children: children
        };

        const element = createComponent(DrawToolbarComponent, params);

        super({
            element: element(),
            target: undefined,
        });
    }
    setMap(map){
        super.setMap(map);
        this._map = map;
    }
}