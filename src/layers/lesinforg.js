import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS.js';
import Config from '../config';

export const GosLesHoz = {
  id: 'lh',
  visible: false,
  title: 'Лесное хозяйство',
  layers: [
    new TileLayer({
      preload: 4,
      minZoom: 9,
      maxZoom: 14,
      source: new XYZ({
        minZoom: 9,
        maxZoom: 14,
        url: `${Config.backend.scheme}://a08.${Config.backend.host}/v2/other/nnforrest/{z}/{x}/{y}.png`
      })
    }), 
    new TileLayer({
      preload: 4,
      minZoom: 8,
      source: new TileWMS({
        transition: 0,
        minZoom: 8,
        maxZoom: 18,
        params: {'TILED': true},
        url: `${Config.backend.scheme}://a08.${Config.backend.host}/v2/other/roslesinforgproxy`
      }),
    })
  ]
};