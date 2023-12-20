import * as Layers from './layers/index';
import Config from './config'
import './index.css'
import './../node_modules/ol/ol.css'
console.log("running index.js")

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';


const indexMap = new Map({
  layers: [Layers.YandexSatellite, Layers.Strelki],
  target: 'map',
  view: new View({
    center: Config.center,
    zoom: Config.zoom,
  }),
});


console.log("created strelki page")