import * as App from './App';
import config from './config'
import './index.css'
import './../node_modules/ol/ol.css'
console.log("running index.js")

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

console.log("added layers")

const baseMaps = new LayerGroup({
    title: 'Base maps',
    layers: [App.BasicOsm, App.OpenTopoMap, App.OpenTopoMapCZ, App.BingSat, ]
  });

const indexMap = new Map({
  layers: [baseMaps],
  target: 'map',
  view: new View({
    center: config.center,
    zoom: config.zoom,
  }),
});

indexMap.addControl(new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'group'
    // collapsed: false,
    // mouseover: true
  })
);

console.log("created map")