import * as App from './App';
import config from './config'
import './index.css'
import './../node_modules/ol/ol.css'
console.log("running index.js")


import BingMaps from 'ol/source/BingMaps.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

const layers = [];
layers.push(
    new TileLayer({
        visible: true,
        preload: Infinity,
        source: new BingMaps({
        key: config.BingKey,
        imagerySet: "Aerial",
        placeholderTiles: false,
        }),
    })
);
const map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [-6655.5402445057125, 6709968.258934638],
    zoom: 13,
  }),
});