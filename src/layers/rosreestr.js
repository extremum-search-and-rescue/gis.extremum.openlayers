import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";


export const PkkRosreestr = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'Росреестр',
    //maxZoom: 18,
    source: new XYZ({
        url: 'https://ngw.fppd.cgkipd.ru/tile/56/{z}/{x}/{y}.png'
    }),
  });