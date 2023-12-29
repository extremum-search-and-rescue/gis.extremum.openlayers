import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export const Strava = {
  id: 'sva',
  visible: false,
  title: 'Strava',
  layers: [
    new TileLayer({
      minZoom: 11,
      preload: 4,
      source: new XYZ({
        transition: 0,
        minZoom: 11,
        maxZoom: 16,
        url: 'https://proxy.nakarte.me/https/heatmap-external-{a-c}.strava.com/tiles-auth/all/purple/{z}/{x}/{y}.png?px=256'
      }),
    }
    ), 
    new TileLayer({
      preload: 4,
      minZoom: 3,
      maxZoom: 11,
      source: new XYZ({
        transition: 0,
        tileSize: 512,
        minZoom: 3,
        maxZoom: 11,
        url: 'https://heatmap-external-{a-c}.strava.com/tiles/all/purple/{z}/{x}/{y}.png?v=19'
      }),
    })
  ]
};