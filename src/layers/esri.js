import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

//https://www.arcgis.com/home/webmap/viewer.html

export const EsriSatellite = {
  id: 'esrI',
  type: 'base',
  title: 'ESRI Satellite',
  tint: 'dark-sat',
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new XYZ({
        tilePixelRatio: window.devicePixelRatio,
        maxZoom: 18,
        urls: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false',
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false'
        ]
      }),
    })
  ]
};