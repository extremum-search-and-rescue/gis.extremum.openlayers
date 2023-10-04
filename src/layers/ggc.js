import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const GosGisCenter = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'GosGisCenter',
    source: new XYZ({
        maxZoom: 15,
        url: 'https://a0{1-3}.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png'
    }),
  });