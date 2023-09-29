import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const Topomapper = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Topomapper',
    source: new XYZ({
        maxZoom: 13,
        urls: [
            'https://layers.extremum.org/v2/other/topomapperproxy/{z}/{x}/{y}.jpg',
        ]
    }),
  });