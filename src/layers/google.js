import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const GoogleSatellite = { 
  id: 'gSat',
  type: 'base',
  baseLayer: true,
  title: 'Google Satellite',
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new XYZ({
        tilePixelRatio: window.devicePixelRatio,
        maxZoom: 18,
        url: 'https://mt{0-3}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
      }),
    })
  ]
};