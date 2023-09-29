import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const StravaLow = new TileLayer({
    preload: Infinity,
    minZoom: 3,
    maxZoom: 11,
    source: new XYZ({
        transition: 0,
        tileSize: 512,
        minZoom: 3,
        maxZoom: 11,
        urls: [
            'https://heatmap-external-a.strava.com/tiles/all/purple/{z}/{x}/{y}.png?v=19',
            'https://heatmap-external-b.strava.com/tiles/all/purple/{z}/{x}/{y}.png?v=19',
            'https://heatmap-external-c.strava.com/tiles/all/purple/{z}/{x}/{y}.png?v=19',
        ]
    }),
  });

const StravaHigh = new TileLayer({
    minZoom: 11,
    source: new XYZ({
        transition: 0,
        minZoom: 11,
        maxZoom: 16,
        urls: [
            'https://proxy.nakarte.me/https/heatmap-external-a.strava.com/tiles-auth/all/purple/{z}/{x}/{y}.png?px=256',
            'https://proxy.nakarte.me/https/heatmap-external-b.strava.com/tiles-auth/all/purple/{z}/{x}/{y}.png?px=256',
            'https://proxy.nakarte.me/https/heatmap-external-a.strava.com/tiles-auth/all/purple/{z}/{x}/{y}.png?px=256',
        ]
    }),
  }
)
export const Strava = new LayerGroup({
    title: "Strava",
    layers: [StravaHigh, StravaLow]
})