import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const OpenSnowMap = {
  id: 'oSN',
  title: 'Opensnowmap',
  visible: false,
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new XYZ({
        maxZoom: 18,
        url: 'https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png'
      }),
    })
  ]
};