import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export const BasicOsm = {
  id: 'osm',
  title: 'Openstreetmap',
  type: 'base',
  tint: 'light-topo',
  visible: true,
  layers: [
    new TileLayer({
      preload: 4,
      source: new OSM(),
    })
  ]
};