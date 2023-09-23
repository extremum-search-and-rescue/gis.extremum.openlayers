import BingMaps from 'ol/source/BingMaps.js';
import TileLayer from 'ol/layer/Tile.js';
import config from './../config'

export const BingSat = new TileLayer({
    baseLayer: true,
    type: 'base',
    title: 'Bing Aerial',
    preload: Infinity,
    source: new BingMaps({
    key: config.BingKey,
    imagerySet: "Aerial",
    placeholderTiles: false,
    }),
})