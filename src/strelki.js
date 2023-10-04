import * as Layers from './layers/index';
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
    layers: [
      Layers.BasicOsm, Layers.OpenTopoMap, Layers.OpenTopoMapCZ, Layers.BingSat, Layers.Topomapper, Layers.GosGisCenter, Layers.EsriSatellite, Layers.PkkRosreestr, Layers.GoogleSatellite, Layers.YandexSatellite, Layers.YandexMaps
     ]
  });
const overlayMaps = new LayerGroup({
  visible: true,
  title: 'Overlay maps',
  layers: [
    Layers.Strelki
   ]
});

const indexMap = new Map({
  layers: [baseMaps, overlayMaps],
  target: 'map',
  view: new View({
    center: config.center,
    zoom: config.zoom,
  }),
});

indexMap.addControl(new LayerSwitcher({
    reverse: true,
    groupSelectStyle: 'none'
    // collapsed: false,
    // mouseover: true
  })
);

console.log("created strelki page")