import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const OpenseamapMarks = { 
  id: 'smr',
  title: 'Sea marks',
  layers: [
    new TileLayer({
      preload: 0,
      source: new XYZ({
        maxZoom: 18,
        url: 'https://t1.openseamap.org/seamark/{z}/{x}/{y}.png'
      }),
    })
  ]
};