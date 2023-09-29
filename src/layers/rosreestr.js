import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";


export const PkkRosreestr = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Росреестр',
    source: new XYZ({
        url: 'https://ngw.fppd.cgkipd.ru/tile/56/{z}/{x}/{y}.png'
    }),
  });