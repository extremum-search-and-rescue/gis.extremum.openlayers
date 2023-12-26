import BaseObject from 'ol/Object';
/**
* @type {{
* name: string,
* available: string
* visible: boolean
* layer: import("ol/layer").Layer
* }}
*/

 /**
 * @type {{
 * basemaps: Array<LayerItem>
 * overlays: Array<LayerItem>
* }}
*/
export class LayersList extends BaseObject
{   
    _map;
    constructor(map, 
                basemaps, 
                setBasemaps, 
                overlays, 
                setOverlays){
        super({
            basemaps: basemaps,
            setBasemaps: setBasemaps,
            overlays: overlays,
            setOverlays: setOverlays,
        })
        this._map = map;
        const self = this;
        this.changeBasemap = (id) => {
            self._map
            .getAllLayers()
            .forEach(l =>{
                if(l.id === id)
                    l.setVisible(true)
                else if (l.type === 'base') {
                    l.setVisible(false);
                }
            });
            setBasemaps({}, 'visible', false)
            setBasemaps(l => l.id === id, 'visible', true)
        }
        this.toggleOverlay = (id, checked) => {
            setOverlays(l => l.id === id , 'visible', checked )
            self._map
            .getAllLayers()
            .filter(l =>l.id === id)
            .forEach(l => l.setVisible(checked))
        }
    }
}