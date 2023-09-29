import TileLayer from "ol/layer/Tile";
import OSM from 'ol/source/OSM';

export const BasicOsm = new TileLayer({
    title: 'Openstreetmap',
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    source: new OSM(),
  });

