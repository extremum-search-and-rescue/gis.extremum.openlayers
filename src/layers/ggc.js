import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const GosGisCenter = {
  id: 'ggc',
  title: 'GosGisCenter',
  type: 'base',
  baseLayer: true,
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        maxZoom: 15,
        url: 'https://a0{1-3}.layers.extremum.org/proxy/ggc/{z}/{x}/{y}.png'
      }),
    })
  ]
};