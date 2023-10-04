import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const GoogleSatellite = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Google Satellite',
    source: new XYZ({
        maxZoom: 18,
        url: 'https://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
    }),
  });