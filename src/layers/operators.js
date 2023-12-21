import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import Config from "../config";

export const MegafonCoverage = {
    id: 'MF',
    title: 'Мегафон',
    visible: false,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                minZoom: 1,
                maxZoom: 12,
                transition: 0,
                url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/megafon/{z}/{x}/{y}.png`
            }),
        })
    ]
}

export const MtsRusCoverage = {
    id: 'MT',
    title: 'МТС',
    visible: false,
    layers: [
    new TileLayer({
        preload: Infinity,
        source: new XYZ({
            minZoom: 7,
            maxZoom: 12,
            transition: 0,
            url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/mtsrus/{z}/{x}/{y}.png`
            }),
        })
    ]
}

export const MtsByCoverage = { 
    id: 'MTb',
    visible: false,
    title: 'МТС Беларусь',
    layers: [ 
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                minZoom: 5,
                maxZoom: 14,
                url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/mtsby/{z}/{x}/{y}.png`
            }),
        })
    ]
}

export const A1ByCoverage = {
    id: 'a1v',
    title: 'A1',
    visible: false,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                minZoom: 5,
                maxZoom: 14,
                url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/a1by/{z}/{x}/{y}.png`
            }),
    })]
}

export const LifeByCoverage = {
    id: 'lfB',
    title: 'Life',
    visible: false,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                minZoom: 6,
                maxZoom: 14,
                url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/lifeby/{z}/{x}/{y}.png`
            }),
        })
    ]
}

export const Tele2Coverage = { 
    id: 'T2',
    title: 'Тele2',
    visible: false,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
            minZoom: 3,
            maxZoom: 12,
            url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/tele2/{z}/{x}/{y}.png`
        }),
    })]
}

export const BeelineCoverage = { 
    id: 'BL',
    title: 'Билайн',
    visible: false,
    layers: [
        new TileLayer({
            preload: Infinity,
            source: new XYZ({
                minZoom: 3,
                maxZoom: 12,
                url: `${Config.backend.scheme}://a08.${Config.backend.host}/proxy/beeline/{z}/{x}/{y}.png`
            }),
        })]
}