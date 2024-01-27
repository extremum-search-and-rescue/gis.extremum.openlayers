/**
 * @module ol/interaction/GisLink
 */
import EventType from 'ol/events/EventType.js';
import Interaction from 'ol/interaction/Interaction.js';
import MapEventType from 'ol/MapEventType.js';
import {listen, unlistenByKey} from 'ol/events.js';
import {toFixed} from 'ol/math.js';
import { fromLonLat, toLonLat } from 'ol/proj.js';

function getParam(hash, name){
  const r = new RegExp(`[#&]${name}=([^&]*)`);
  const exec = r.exec(hash);
  return exec ? exec[1] : null;
}

function setOrReplaceParam(hash, name, value){
  const param = getParam(hash, name);
  if(param)
    return hash.replace(param, value);
  else {
    return hash+= `${hash == '' ? '#' : '&'}${name}=${value}`;
  }
}

/**
 * @param {number} number A number.
 * @return {number} A number with at most 5 decimal places.
 */
function to5(number) {
  return toFixed(number, 5);
}

/**
 * @param {string} string A string.
 * @return {number} A number representing the string.
 */
function readNumber(string) {
  return parseFloat(string);
}

/**
 * @param {number} number A number.
 * @return {string} A string representing the number.
 */
function writeNumber(number) {
  return to5(number).toString();
}

/**
 * @param {number} a A number.
 * @param {number} b A number.
 * @return {boolean} The numbers are different.
 */
function differentNumber(a, b) {
  if (isNaN(a)) {
    return false;
  }
  return a !== readNumber(writeNumber(b));
}

/**
 * @param {Array<number>} a An array of two numbers.
 * @param {Array<number>} b An array of two numbers.
 * @return {boolean} The arrays are different.
 */
function differentArray(a, b) {
  return differentNumber(a[0], b[0]) || differentNumber(a[1], b[1]);
}

/** @typedef {'z'|'c'|'r'|'l'} Params */

/**
 * @typedef {function(string):void} Callback
 */

/**
 * @typedef {Object} Options
 * @property {boolean|import('../View.js').AnimationOptions} [animate=true] Animate view transitions.
 * @property {Array<Params>} [params=['z', 'c' 'r', 'l']] Properties to track. Default is to track
 * `x` (center x), `y` (center y), `z` (zoom), `r` (rotation) and `l` (layers).
 * @property {boolean} [replace=true] Replace the current URL without creating the new entry in browser history.
 * By default, changes in the map state result in a new entry being added to the browser history.
 * @property {string} [prefix=''] By default, the URL will be updated with search parameters x, y, z, and r.  To
 * avoid collisions with existing search parameters that your application uses, you can supply a custom prefix for
 * the ones used by this interaction (e.g. 'ol:').
 */

/**
 * @classdesc
 * An interaction that synchronizes the map state with the URL. Compatiple with older GIS versions
 *
 * @api
 */
export class GisLink extends Interaction {
  /**
   * @param {Options} [options] Link options.
   */
  constructor(options) {
    super();

    options = Object.assign(
      {
        animate: true,
        params: ['z', 'c', 'l', 'r'],
        replace: true,
        prefix: '',
      },
      options || {}
    );

    let animationOptions;
    if (options.animate === true) {
      animationOptions = {duration: 250};
    } else if (!options.animate) {
      animationOptions = null;
    } else {
      animationOptions = options.animate;
    }

    /**
     * @type {import('../View.js').AnimationOptions|null}
     * @private
     */
    this.animationOptions_ = animationOptions;

    /**
     * @type {Object<Params, boolean>}
     * @private
     */
    this.params_ = options.params.reduce((acc, value) => {
      acc[value] = true;
      return acc;
    }, {});

    /**
     * @private
     * @type {boolean}
     */
    this.replace_ = options.replace;

    /**
     * @private
     * @type {string}
     */
    this.prefix_ = options.prefix;

    /**
     * @private
     * @type {!Array<import("../events.js").EventsKey>}
     */
    this.listenerKeys_ = [];

    /**
     * @private
     * @type {boolean}
     */
    this.initial_ = true;

    this.updateState_ = this.updateState_.bind(this);

    /**
     * The tracked parameter callbacks.
     * @private
     * @type {Object<string, Callback>}
     */
    this.trackedCallbacks_ = {};

    /**
     * The tracked parameter values.
     * @private
     * @type {Object<string, string|null>}
     */
    this.trackedValues_ = {};
  }

  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(map) {
    const oldMap = this.getMap();
    super.setMap(map);
    if (map === oldMap) {
      return;
    }
    if (oldMap) {
      this.unregisterListeners_(oldMap);
    }
    if (map) {
      this.initial_ = true;
      if(window.localStorage && !(new URL(window.location.href).hash)) {
        const savedHash = window.localStorage.getItem('hash');
        this.updateState_(savedHash);
      }
      else
        this.updateState_();
      this.registerListeners_(map);
    }
  }

  /**
   * @param {import("../Map.js").default} map Map.
   * @private
   */
  registerListeners_(map) {
    this.listenerKeys_.push(
      listen(map, MapEventType.MOVEEND, this.updateUrl_, this),
      listen(map.getLayerGroup(), EventType.CHANGE, this.updateUrl_, this),
      listen(map, 'change:layergroup', this.handleChangeLayerGroup_, this)
    );

    if (!this.replace_) {
      addEventListener('hashchange', this.updateState_);
    }
  }

  /**
   * @param {import("../Map.js").default} map Map.
   * @private
   */
  unregisterListeners_(map) {
    for (let i = 0, ii = this.listenerKeys_.length; i < ii; ++i) {
      unlistenByKey(this.listenerKeys_[i]);
    }
    this.listenerKeys_.length = 0;

    if (!this.replace_) {
      removeEventListener('hashchange', this.updateState_);
    }

    const url = new URL(window.location.href);
    window.history.replaceState(null, '', url.href.replace(url.hash,''));
  }

  /**
   * @private
   */
  handleChangeLayerGroup_() {
    const map = this.getMap();
    if (!map) {
      return;
    }
    this.unregisterListeners_(map);
    this.registerListeners_(map);
    this.initial_ = true;
    this.updateUrl_();
  }

  /**
   * @private
   */
  updateState_(savedHash) {
    const hash = savedHash ?? new URL(window.location.href).hash;
    for (const key in this.trackedCallbacks_) {
      const value = getParam(hash, key);
      if (key in this.trackedCallbacks_ && value !== this.trackedValues_[key]) {
        this.trackedValues_[key] = value;
        this.trackedCallbacks_[key](value);
      }
    }

    const map = this.getMap();
    if (!map) {
      return;
    }
    const view = map.getView();
    if (!view) {
      return;
    }

    let updateView = false;

    /**
     * @type {import('../View.js').AnimationOptions}
     */
    const viewProperties = {};

    const zoom = readNumber(getParam(hash, 'z'));
    if ('z' in this.params_ && !isNaN(zoom) && differentNumber(zoom, view.getZoom())) {
      updateView = true;
      viewProperties.zoom = zoom;
    }

    const rotation = readNumber(getParam(hash, 'r'));
    if ('r' in this.params_ && differentNumber(rotation, view.getRotation())) {
      updateView = true;
      viewProperties.rotation = rotation;
    }
    let centerRaw = getParam(hash, 'c');
    if(centerRaw) {
      centerRaw = centerRaw.split('/');
      const center = fromLonLat([
        readNumber(centerRaw[1]),
        readNumber(centerRaw[0])],
      'EPSG:3857');
      if (!isNaN(center[0]) && !isNaN(center[1]) && differentArray(center, view.getCenter())) {
        updateView = true;
        viewProperties.center = center;
      }
    }

    if (updateView) {      
      if (!this.initial_ && this.animationOptions_) {
        view.animate(Object.assign(viewProperties, this.animationOptions_));
      } else {
        if (viewProperties.center) {
          view.setCenter(viewProperties.center);
        }
        if ('zoom' in viewProperties) {
          view.setZoom(viewProperties.zoom);
        }
        if ('rotation' in viewProperties) {
          view.setRotation(viewProperties.rotation);
        }
      }
    }

    const layers = map.getAllLayers();
    const layersParam = getParam(hash, 'l');
  
    if ('l' in this.params_ && layersParam) {
      const layerIds = layersParam.split('/');
      for (let i = 0; i < layerIds.length; i++ ) {
        const value = layerIds[i];
        const visible = Boolean(value);
        const layer = layers.find(l => l.id === value);
        if (layer && layer.getVisible() !== visible) {
          //TODO: use LayerService to make correct layer update instead of direct ammending layer list
          layer.setVisible(visible);
        }
      }
    }
  }

  /**
   * Register a listener for a URL search parameter.  The callback will be called with a new value
   * when the corresponding search parameter changes due to history events (e.g. browser navigation).
   *
   * @param {string} key The URL search parameter.
   * @param {Callback} callback The function to call when the search parameter changes.
   * @return {string|null} The initial value of the search parameter (or null if absent from the URL).
   * @api
   */
  track(key, callback) {
    this.trackedCallbacks_[key] = callback;
    const value = getParam(key);
    this.trackedValues_[key] = value;
    return value;
  }

  /**
   * Update the URL with a new search parameter value.  If the value is null, it will be
   * deleted from the search parameters.
   *
   * @param {string} key The URL search parameter.
   * @param {string|null} value The updated value (or null to remove it from the URL).
   * @api
   */
  update(key, value) {
    const url = new URL(window.location.href);
    if (value === null) {
      //params.delete(key);
    } else {
      setOrReplaceParam(url, key, value);
    }
    if (key in this.trackedValues_) {
      this.trackedValues_[key] = value;
    }
    this.updateHistory_(url);
  }

  /**
   * @private
   */
  updateUrl_() {
    const map = this.getMap();
    if (!map) {
      return;
    }
    const view = map.getView();
    if (!view) {
      return;
    }

    const center = view.getCenter();
    const zoom = view.getZoom();
    const rotation = view.getRotation();

    const layers = map.getAllLayers();
    const visibilities = new Array();
    for (let i = 0; i < layers.length; i++) {
      if(layers[i].getVisible() && layers[i].id)
        visibilities.push(layers[i].id);
    }

    const url = new URL(window.location.href);

    let hash = url.hash;
    const lonLat = toLonLat(center, 'EPSG:3857');

    if(zoom && !isNaN(zoom))
      hash = setOrReplaceParam(hash,'z', writeNumber(zoom.toFixed(1)));
    if(lonLat[0] && !isNaN(lonLat[0]))
      hash = setOrReplaceParam(hash, 'c', `${writeNumber(lonLat[1])},${writeNumber(lonLat[0])}`);
    if(visibilities.length> 0)
      hash = setOrReplaceParam(hash, 'l', visibilities.join('/'));

    if(rotation != 0) 
      hash = setOrReplaceParam(hash, 'r', writeNumber(rotation));
    
    this.updateHistory_(hash);
    this.initial_ = false;
  }

  /**
   * @private
   * @param {string} hash Hash part of URL.
   */
  updateHistory_(hash) {
    if (hash !== window.location.hash) {
      if (this.initial_ || this.replace_) {
        const url = new URL(window.location.href);
        url.hash = hash;
        window.history.replaceState(history.state, '', url);
        if(window.localStorage){
          window.localStorage.setItem('hash', hash);
        }
      } else {
        window.history.pushState(null, '', hash);
      }
    }
  }
}
