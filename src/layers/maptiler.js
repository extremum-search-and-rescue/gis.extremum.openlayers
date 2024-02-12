import Config from './../config.js';
import {applyBackground, applyStyle} from 'ol-mapbox-style';
import LayerGroup from 'ol/layer/Group.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';

//const styleJson = `https://api.maptiler.com/maps/df7a72a4-1a85-4bb1-a76a-425203e4f171/style.json?key=${Config.MapTilerKey}`;

const styleStreets = `https://api.maptiler.com/maps/streets-v2/style.json?key=${Config.MapTilerKey}`;

const layer = new LayerGroup({
  layers: [
    new VectorTileLayer({
      declutter: true,
      source: new VectorTileSource({}),
    })
  ]
});
const layer2 =new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({}),
});

export const MapTilerLayer = {
  id: 'mtv',
  title: 'Map Tiler Outdoor',
  type: 'base',
  layers: [layer2]
};
applyStyle(layer2, styleStreets);
applyBackground(layer2, styleStreets);

