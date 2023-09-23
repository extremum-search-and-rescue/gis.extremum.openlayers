import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

//https://www.arcgis.com/home/webmap/viewer.html

export const EsriSatellite = new TileLayer({
    type: 'base',
    baseLayer: true,
    title: 'ESRI Satellite',
    //maxZoom: 18,
    source: new XYZ({
        urls: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false',
            'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false'
        ]
    }),
  });