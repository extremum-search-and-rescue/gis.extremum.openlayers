import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const OpenSnowMap = {
  id: 'oSN',
  title: 'Opensnowmap',
  type: 'base',
  baseLayer: true,
  visible: false,
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new XYZ({
          maxZoom: 18,
          url: 'https://tiles.opensnowmap.org/base_snow_map/{z}/{x}/{y}.png?debug1'
          }),
      }),
      new TileLayer({
        preload: Infinity,
        source: new XYZ({
            maxZoom: 18,
            url: 'https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png'
            }),
        })
  ]
}