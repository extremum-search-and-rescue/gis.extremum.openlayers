import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const OpenTopoMap = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'Opentopomap.org',
    maxZoom: 16,
    source: new XYZ({
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
    maxZoom: 18,
    source: new XYZ({
        urls: [
            'https://tile-a.opentopomap.cz/{z}/{x}/{y}.png',
            'https://tile-b.opentopomap.cz/{z}/{x}/{y}.png',
            'https://tile-c.opentopomap.cz/{z}/{x}/{y}.png',
        ]
    }),
});