import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const PkkRosreestr = {
  id: 'ppk',
  type: 'base',
  baseLayer: true,
  title: 'Росреестр',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        url: 'https://ngw.fppd.cgkipd.ru/tile/56/{z}/{x}/{y}.png'
      }),
    })
  ]
};