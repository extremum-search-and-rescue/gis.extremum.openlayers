import BingMaps from 'ol/source/BingMaps.js';
import TileLayer from 'ol/layer/Tile.js';
import Config from './../config';

export const BingSat = { 
  id: 'bS',
  baseLayer: true,
  type: 'base',
  title: 'Bing Aerial',
  layers: [ 
    new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        tilePixelRatio: window.devicePixelRatio,
        key: Config.BingKey,
        imagerySet: 'Aerial',
        placeholderTiles: false,
      }),
    })
  ]
};