import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, get as getProjection } from "ol/proj";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";

proj4.defs(
  "EPSG:3395",
  "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
);
register(proj4);
var proj3395 = getProjection("EPSG:3395");
var half = Math.abs(fromLonLat([180, 0], proj3395)[0]);
proj3395.setExtent([-half, -half, half, half]);
proj3395.setGlobal(true);

export const YandexSatellite = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'YandexSatellite',
    preload: Infinity,
    source: new XYZ({
        urls: [
            'https://sat01.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
            'https://sat02.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
            'https://sat03.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}',
            'https://sat04.maps.yandex.net/tiles?l=sat&x={x}&y={y}&z={z}'
        ],
        projection: proj3395    
    }),
  });

  export const YandexMaps = new TileLayer({
    type: 'base',
    baseLayer: true,
    preload: Infinity,
    title: 'Yandex Maps',
    source: new XYZ({
        url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}',
        projection: proj3395    
    }),
  });