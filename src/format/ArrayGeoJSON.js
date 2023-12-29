import GeoJSON from 'ol/format/GeoJSON';

/**
 * @param {Document|Element|Object|string} source Source.
 * @return {Object} Object.
 */
function getObject(source) {
  if (typeof source === 'string') {
    const object = JSON.parse(source);
    return object ? /** @type {Object} */ (object) : null;
  }
  if (source !== null) {
    return source;
  }
  return null;
}

function isEmptyFeature(featureCollection) {
  return featureCollection.features.length==1 && featureCollection.features[0].type == null;
}

class ArrayGeoJSON extends GeoJSON {

  constructor(options){
    super(options);
  }
  /**
   * Read all features.  Works with both a single feature and a feature
   * collection.
   *
   * @param {ArrayBuffer|Document|Element|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions} [options] Read options.
   * @return {Array<import("../Feature.js").FeatureLike>} Features.
   * @api
   */
  readFeatures(source, options) {
    if(source == null || source == '') return [];
    if(source instanceof Array)
    {
      let retval = new Array();
      for(let i = 0; i < source.length; i++)
      {
        const feature = source[i];
                
        if(feature.type === 'FeatureCollection' && isEmptyFeature(feature))
          continue;
                
        retval.push(this.readFeaturesFromObject(
          getObject(feature),
          this.getReadOptions(feature, options)
        ));  
      }
      return retval.flatMap(f => f);
    }
    if(source.type === 'FeatureCollection' && isEmptyFeature(source))
      return [];
    return this.readFeaturesFromObject(
      getObject(source),
      this.getReadOptions(source, options));
  }
}

export default ArrayGeoJSON;