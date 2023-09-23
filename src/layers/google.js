import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const GoogleSatellite = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'Google Satellite',
    //maxZoom: 18,
    source: new XYZ({
        urls: [
            'https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
            'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        ]
    }),
  });