/* eslint-disable no-unused-vars */
import TextFeature from 'ol/format/TextFeature';
import { LineString, MultiLineString } from 'ol/geom';
import { abstract } from 'ol/util';
import { get as getProjection, getUserProjection, useGeographic } from 'ol/proj.js';
import { Feature } from 'ol';
import { transformGeometryWithOptions } from 'ol/format/Feature.js';
// PTL spec: https://www.oziexplorer4.com/eng/help/fileformats.html

const PLT_LINE_REGEX = /(\d{1,2}\.\d{1,16}),\s*(-?\d{1,3}\.\d{1,16}),\s*([0,1]),\s*(-?\d+(\.\d+)?),\s*(\d{1,6}\.\d{1,15})?/;

const FIELD_LATITUDE = 0;
const FIELD_LONGITUDE = 1;
const FIELD_IS_NEW_PART = 2;
const NEW_PART = '1';

class PLT extends TextFeature
{
  constructor(options){
    options = options ? options : {};
    super();
    /**
     * @type {import("../proj/Projection.js").default}
     */
    this.dataProjection = getProjection(
      options.dataProjection ? options.dataProjection : 'EPSG:4326');

    this.defaultFeatureProjection = getProjection('EPSG:3857');
  }
  /**
   * Read the feature from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../Feature.js").default} Feature.
   * @api
   */
  readFeature(source, options) {
    return this.readFeatureFromText(
      getText(source),
      this.adaptOptions(options)
    );
  }

  /**
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../Feature.js").default} Feature.
   */
  readFeatureFromText(text, options) {
    return this.readFeaturesFromText(text, options)[0];
  }

  /**
   * Read the features from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @api
   */
  readFeatures(source, options) {
    return this.readFeaturesFromText(
      getText(source),
      this.adaptOptions(options)
    );
  }

  /**
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  readFeaturesFromText(text, options) {
    const lines = getLines(text);
    const tracks = [];
    if(lines.length < 7) return [];
    let currentTrack;
    for(let i = 6; i< lines.length; i++)
    {
      let line = lines[i].match(PLT_LINE_REGEX);
      if(!line) continue;

      const lon = parseFloat(line[1+FIELD_LONGITUDE]);
      const lat = parseFloat(line[1+FIELD_LATITUDE]);

      const coord = [lon, lat];

      if(line[1+FIELD_IS_NEW_PART] == NEW_PART){
        if(currentTrack) tracks.push(currentTrack);

        currentTrack = [];
      }
      currentTrack.push(coord);
    }
    if(currentTrack) tracks.push(currentTrack);

    const feature = new Feature();
    let geometry;
    if(tracks.length === 1)
    {
      geometry = new LineString(tracks[0]);
      
    }
    else if(tracks.length>1)
    {
      geometry = new MultiLineString(tracks);
    }
    feature.setGeometry(
      transformGeometryWithOptions(
        geometry,
        false,
        this.adaptOptions(options)
      ));
    return [feature];
  }

  /**
   * Read the geometry from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @api
   */
  readGeometry(source, options) {
    return this.readGeometryFromText(
      getText(source),
      this.adaptOptions(options)
    );
  }

  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  readGeometryFromText(text, options) {
    return this.readFeatureFromText(text, options);
  }

  /**
   * Read the projection from the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   * @api
   */
  readProjection(source) {
    return this.dataProjection;
  }

  /**
   * @param {string} text Text.
   * @protected
   * @return {import("../proj/Projection.js").default|undefined} Projection.
   */
  readProjectionFromText(text) {
    return this.dataProjection;
  }

  /**
   * Encode a feature as a string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded feature.
   * @api
   */
  writeFeature(feature, options) {
    return this.writeFeatureText(feature, this.adaptOptions(options));
  }

  /**
   * @abstract
   * @param {import("../Feature.js").default} feature Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeFeatureText(feature, options) {
    return abstract();
  }

  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Encoded features.
   * @api
   */
  writeFeatures(features, options) {
    return this.writeFeaturesText(features, this.adaptOptions(options));
  }

  /**
   * @abstract
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeFeaturesText(features, options) {
    return abstract();
  }

  /**
   * Write a single geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @return {string} Geometry.
   * @api
   */
  writeGeometry(geometry, options) {
    return this.writeGeometryText(geometry, this.adaptOptions(options));
  }

  /**
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions} [options] Write options.
   * @protected
   * @return {string} Text.
   */
  writeGeometryText(geometry, options) {
    return abstract();
  }
}


/**
 * @param {Document|Element|Object|string} source Source.
 * @return {string} Text.
 */
function getText(source) {
  if (typeof source === 'string') {
    return source;
  }
  return '';
}

/**
 * @param {Document|Element|Object|string} source Source.
 * @return {Array<string>} Lines.
 */
function getLines(source){
  return getText(source).split(/[\n\u0085\u2028\u2029]|\r\n?/g);
}

export default PLT;
