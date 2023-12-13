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
import Config from '../config';

const bodyStyles = window.getComputedStyle(document.body);
  /**
   * @param {GeoJSON.Point} feature 
   * @param {number} resolution 
   * @returns {Text}
   */
const createTextStyle = function (feature, resolution) {
  const fill = bodyStyles.getPropertyValue('--red-700');
    return new Text({
      font: "Arial 12px",
      align: "left",
      text: feature.get('number'),
      fill: new Fill({color: fill}),
      stroke: new Stroke({color: "white", width: 1}),
      offsetX: 8,
      offsetY: 0,
      placement: "Point",
      maxAngle: "45",
      overflow: true,
      rotation: 0,
    });
  };

  /**
   * @param {GeoJSON.Point} feature 
   * @param {number} resolution 
   * @returns {Style}
   */
function pointStyleFunction(feature, resolution) {
  const stroke = bodyStyles.getPropertyValue('--red-500');
    return new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({color: 'rgba(255, 0, 0, 0.1)'}),
        stroke: new Stroke({color: stroke, width: 1}),
      }),
      text: createTextStyle(feature, resolution),
      //title: feature.get("text")
    });
  }

  export const Strelki = new VectorLayer({
    title: "Стрелки",
    visible: false,
    source: new VectorSource({
      url: `${Config.backend.scheme}://${Config.backend.host}/v3/strelki/all.geojson`,
      format: new GeoJSON(),
    }),
    style: pointStyleFunction,
  });