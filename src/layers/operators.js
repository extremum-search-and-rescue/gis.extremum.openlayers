import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

export const MegafonCoverage = new TileLayer({
    title: 'Мегафон',
    visible: false,
    source: new XYZ({
        minZoom: 1,
        maxZoom: 12,
        transition: 0,
        urls: [
            'https://a08.layers.extremum.org/proxy/megafon/{z}/{x}/{y}.png',
        ]
    }),
  });

export const MtsRusCoverage = new TileLayer({
    title: 'МТС',
    visible: false,
    source: new XYZ({
        minZoom: 7,
        maxZoom: 12,
        transition: 0,
        urls: [
            'https://a08.layers.extremum.org/proxy/mtsrus/{z}/{x}/{y}.png',
        ]
    }),
});

  export const MtsByCoverage = new TileLayer({
    visible: false,
    title: 'МТС Беларусь',
    source: new XYZ({
        minZoom: 5,
        maxZoom: 14,
        urls: [
            'https://a08.layers.extremum.org/proxy/mtsby/{z}/{x}/{y}.png',
        ]
    }),
  });

export const A1ByCoverage = new TileLayer({
    title: 'A1',
    visible: false,
    source: new XYZ({
        minZoom: 5,
        maxZoom: 14,
        urls: [
            'https://a08.layers.extremum.org/proxy/a1by/{z}/{x}/{y}.png',
        ]
    }),
});

export const LifeByCoverage = new TileLayer({
    title: 'Life',
    visible: false,
    source: new XYZ({
        minZoom: 6,
        maxZoom: 14,
        urls: [
            'https://a08.layers.extremum.org/proxy/lifeby/{z}/{x}/{y}.png',
        ]
    }),
});

export const Tele2Coverage = new TileLayer({
    title: 'Т2',
    visible: false,
    source: new XYZ({
        minZoom: 3,
        maxZoom: 12,
        urls: [
            'https://a08.layers.extremum.org/proxy/tele2/{z}/{x}/{y}.png',
        ]
    }),
});

export const BeelineCoverage = new TileLayer({
    title: 'Билайн',
    visible: false,
    source: new XYZ({
        minZoom: 3,
        maxZoom: 12,
        urls: [
            'https://a08.layers.extremum.org/proxy/beeline/{z}/{x}/{y}.png',
        ]
    }),
});