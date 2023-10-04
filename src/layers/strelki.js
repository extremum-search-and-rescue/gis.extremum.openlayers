import GeoJSON from 'ol/format/GeoJSON.js';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
    Text
  } from 'ol/style.js';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

const createTextStyle = function (feature, resolution) {
    return new Text({
      font: "Arial 12px",
      align: "left",
      text: feature.get('name'),
      fill: new Fill({color: "red"}),
      stroke: new Stroke({color: "white", width: 1}),
      offsetX: 8,
      offsetY: 0,
      placement: "Point",
      maxAngle: "45",
      overflow: true,
      rotation: 0,
    });
  };


function pointStyleFunction(feature, resolution) {
    debugger;
    return new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({color: 'rgba(255, 0, 0, 0.1)'}),
        stroke: new Stroke({color: 'red', width: 1}),
      }),
      text: createTextStyle(feature, resolution),
    });
  }

  export const Strelki = new VectorLayer({
    title: "Стрелки",
    visible: false,
    source: new VectorSource({
      url: 'https://192.168.1.10:8001/v3/strelki/all.geojson',
      //url: 'https://layers.extremum.org/v3/strelki/all.geojson',
      format: new GeoJSON(),
    }),
    style: pointStyleFunction,
  });