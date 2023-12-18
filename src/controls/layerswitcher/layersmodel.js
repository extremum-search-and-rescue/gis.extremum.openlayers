/**
* @type {{
* name: string,
* available: string
* visible: boolean
* layer: import("ol/layer").Layer
* }}
*/
export class LayerItem
{
    
}
 /**
 * @type {{
 * basemaps: Array<LayerItem>
 * overlays: Array<LayerItem>
* }}
*/
export class LayersModel
{
    basemaps = [];
    overlays = [];
}