import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Config } from '../config';

export const PkkRosreestr = {
  id: 'ppk',
  type: 'base',
  baseLayer: true,
  tint: 'vivid-topo',
  title: 'Росреестр',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        maxZoom: 14,
        url: `${Config.backend.scheme}://${Config.backend.host}/proxy/pkk/{z}/{x}/{y}.png`
      }),
    })
  ]
};