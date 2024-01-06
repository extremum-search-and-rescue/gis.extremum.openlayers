import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const OpenTopoMap = {
  id: 'oTG',
  type: 'base',
  tint: 'vivid-topo',
  title: 'Opentopomap.org',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        maxZoom: 16,
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png'
      }),
    })
  ]
};

export const OpenTopoMapCZ = { 
  id: 'oTopo',
  type: 'base',
  tint: 'vivid-topo',
  title: 'Opentopomap.cz',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        maxZoom: 18,
        url: 'https://tile-{a-c}.opentopomap.cz/{z}/{x}/{y}.png'
      }),
    })
  ]
};