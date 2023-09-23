import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const GosGisCenter = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'GosGisCenter',
    maxZoom: 15,
    source: new XYZ({
        urls: [
            'https://a01.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png',
            'https://a02.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png',
            'https://a03.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png',
            'https://a04.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png'
        ]
    }),
  });