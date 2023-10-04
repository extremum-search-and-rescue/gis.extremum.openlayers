import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const OpenTopoMap = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Opentopomap.org',
    source: new XYZ({
        maxZoom: 16,
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
    }),
  });
export const OpenTopoMapCZ = new TileLayer({
    type: 'base',
    title: 'Opentopomap.cz',
    preload: 1,
    source: new XYZ({
        maxZoom: 18,
        url: 'https://tile-{a-c}.opentopomap.cz/{z}/{x}/{y}.png'
    }),
});