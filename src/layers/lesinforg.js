import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import TileWMS from 'ol/source/TileWMS.js';

const ShapesKV = new TileLayer({
    preload: Infinity,
    minZoom: 8,
    source: new TileWMS({
        transition: 0,
        minZoom: 8,
        maxZoom: 18,
        params: {'TILED': true},
        url: 'https://a08.layers.extremum.org/v2/other/roslesinforgproxy'
    }),
  });

const NnLayers = new TileLayer({
    minZoom: 9,
    maxZoom: 14,
    source: new XYZ({
        minZoom: 9,
        maxZoom: 14,
        url: 'https://a08.layers.extremum.org/v2/other/nnforrest/{z}/{x}/{y}.png'
    })
});

export const GosLesHoz = new LayerGroup({
    visible: false,
    title: 'Лесное хозяйство',
    layers: [NnLayers, ShapesKV]
});