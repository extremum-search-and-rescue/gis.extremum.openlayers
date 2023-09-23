import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const Topomapper = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'Topomapper',
    maxZoom: 13,
    source: new XYZ({
        urls: [
            'https://layers.extremum.org/v2/other/topomapperproxy/{z}/{x}/{y}.jpg',
        ]
    }),
  });