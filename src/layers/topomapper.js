import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const Topomapper = { 
    id: 'tm',
    title: 'Topomapper',
    type: 'base',
    baseLayer: true,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                maxZoom: 13,
                url: 'https://a0{1-3}.layers.extremum.org/v2/other/topomapperproxy/{z}/{x}/{y}.jpg'
            }),
        })
    ]
}