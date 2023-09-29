import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const OpenTopoMap = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Opentopomap.org',
    source: new XYZ({
        maxZoom: 16,
        urls: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
        ]
    }),
  });
export const OpenTopoMapCZ = new TileLayer({
    type: 'base',
    title: 'Opentopomap.cz',
    source: new XYZ({
        maxZoom: 18,
        urls: [
            'https://tile-a.opentopomap.cz/{z}/{x}/{y}.png',
            'https://tile-b.opentopomap.cz/{z}/{x}/{y}.png',
            'https://tile-c.opentopomap.cz/{z}/{x}/{y}.png',
        ]
    }),
});