import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, get as getProjection } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import {Config } from '../config';

proj4.defs(
  'EPSG:3395',
  '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
);
register(proj4);
var proj3395 = getProjection('EPSG:3395');
var half = Math.abs(fromLonLat([180, 0], proj3395)[0]);
proj3395.setExtent([-half, -half, half, half]);
proj3395.setGlobal(true);


setInterval(function(){
  if(YandexRainClouds && YandexRainClouds.layers && YandexRainClouds.layers.find(f => f.getVisible())) {
    YandexRainClouds.layers.forEach(l => l.getSource().refresh());
  }
}, 60000);

export const YandexRainClouds = {
  id: 'rc',
  title: 'Rain Clouds',
  layers: [
    new TileLayer({
      preload: Infinity,
      minZoom: 3,
      maxZoom: 13,
      opacity: 0.2,
      source: new XYZ({
        minZoom: 3,
        maxZoom: 13,
        url: `${Config.backend.scheme}://${Config.backend.host}/v2/other/rainclouds/{z}/{x}/{y}.png`,
        projection: proj3395    
      }),
    })
  ]
};

export const YandexSatellite = {
  id: 'yaSat',
  type: 'base',
  baseLayer: true,
  tint: 'dark-sat',
  title: 'YandexSatellite',
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new XYZ({
        tilePixelRatio: window.devicePixelRatio,
        url: 'https://sat0{1-4}.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
        projection: proj3395    
      }),
    })
  ]
};

export const YandexMaps = { 
  id: 'yaMap',
  type: 'base',
  baseLayer: true,
  tint: 'light-topo',
  title: 'Yandex Maps Day',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
        projection: proj3395    
      }),
    })
  ]
};

export const YandexMapsDark = {
  id: 'yaMn',
  type: 'base',
  baseLayer: true,
  tint: 'dark-topo',
  title: 'Yandex Maps Night',
  layers: [
    new TileLayer({
      preload: 4,
      source: new XYZ({
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&theme=dark&x={x}&y={y}&z={z}',
        projection: proj3395    
      }),
    })
  ]
};

export const YandexHybridLayer = 
    new TileLayer({
      preload: 4,
      maxZoom: 13,
      source: new XYZ({
        transition: 0,
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=skl&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
        projection: proj3395    
      }),
    });
