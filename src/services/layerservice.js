import { createStore } from 'solid-js/store';
import { useService } from 'solid-services';
import { MapContext } from './mapcontext';
import { Vector as VectorSource } from 'ol/source.js';
import EventType from 'ol/events/EventType.js';
import { CollectionEvent } from 'ol/Collection';
import { Layer, Vector as VectorLayer } from 'ol/layer.js';
import { Map } from 'ol';

/**
 * Changes html class of map container to propagate classes to child controls for adaptation of map tint
 * @param {Map} map 
 * @param {Layer} bm 
 */
function updateMapTint(map, bm){
  if(!map) throw new Error('no map context');
  if(!bm) throw new Error('no vibisble basemap in tint function');
  const targetElement = map.getTargetElement();
  //const visibleBasemapLayerTint = bm.layers.filter(l => l.visible).tint;
  const visibleBasemapTint = bm.tint;
  targetElement.classList = '';
  targetElement.classList.toggle(`map-${visibleBasemapTint || 'default'}`);
}

export function LayerService() {
  const [bm, setBm] = createStore([]);
  const [om, setOm] = createStore([]);
  const [ul, setUl] = createStore([]);
  const [mc, setMc] = createStore([{
    asLayerId: 'SC',
    title: 'Sun and Moon',
    visible: false
  }]);

  const userDrawingSurface = new VectorSource({
    wrapX: false,
  });
            
  const vectorDrawingLayer = new VectorLayer({
    id: 'draw',
    visible: true,
    source: userDrawingSurface,
  });
  vectorDrawingLayer.setVisible(true);

  const localUserObjectsLayer = new VectorLayer({
    id: 'user-objects',
    visible: true,
    source: new VectorSource()
  });

  const userLocationLayer = new VectorLayer({
    id: 'user-geo',
    visible: true,
    source: new VectorSource()
  });

  setUl([vectorDrawingLayer, userLocationLayer]);

  const getMapcontext = useService(MapContext);
  return {
    addFeaturesFromEvent(event, map){
      const source = localUserObjectsLayer.get('source');
      source.addFeatures(event.features);
      map.getView().fit(source.getExtent());
    },
    addFeatures(features, map, fitMap = true)
    {
      const source = localUserObjectsLayer.get('source');
      source.addFeatures(features);
      if(fitMap) map.getView().fit(source.getExtent());
    },

    /**
     * @returns {Array<Layer>}
     */
    get basemaps() {
      return bm;
    },
    /**
     * @param {Array<Layer>} basemaps 
     */
    set basemaps(basemaps){
      setBm(basemaps);
    },
    /**
     * @returns {Array<Layer>}
     */
    get overlays() {
      return om; 
    },
    /**
     * @param {Array<Layer>} overlays 
     */
    set overlays(overlays) {
      setOm(overlays);
    },
    /**
     * 
     * @param {string} id 
     * @param {boolean} checked 
     * @param {Map?} map 
     */
    toggleOverlay(id, checked, map) {
      setOm(l => l.id === id , 'visible', checked );
      const currentMap = map ?? getMapcontext().map();
      
      currentMap
        .getAllLayers()
        .filter(l =>l.id === id)
        .forEach(l => l.setVisible(checked));
    },
    /**
     * Switches map to use basemap with specified id
     * @param {string} id 
     * @param {Map?} map 
     */
    changeBasemap(id, map){
      setBm({}, 'visible', false); //sets all basemaps as hidden
      setBm(l => l.id === id, 'visible', true);
      const currentMap = map ?? getMapcontext().map();

      currentMap
        .getAllLayers()
        .filter(l => l.type == 'base')
        .forEach(l =>l.setVisible(l.id === id));
      
      updateMapTint(currentMap, bm.filter(bm => bm.visible)[0]);
    },
    /**
     * @param {string} id
     * @param {boolean} checked 
     * @param {Map?} map
     */
    toggleControl(id, checked, map){
      const currentMap = map ?? getMapcontext().map();
      const togglableControls = currentMap.getControls().getArray().filter(c => c.asLayerId);
      setMc(c => c.asLayerId === id, 'visible', checked);
      if(togglableControls) {
        for(let i = 0; i<togglableControls.length; i++) {
          const control = togglableControls[i];
          if(control.asLayerId === id){
            control.setVisible(checked);
            currentMap.getControls().dispatchEvent(
              new CollectionEvent(EventType.CHANGE, control)
            );
          }
        }
      }
    },

    /**
     * @returns {Array<{import('ol/control/control.js').Control}>}
     */
    get controlStates(){
      return mc;
    },
    /**
     * Gets user defined basemap tint. 
     * Tint describes map type and allows to adapt to its darkness or saturation
     * @returns {string}
     */
    get mapTint(){
      return bm.filter(b => b.visible)[0].layers.filter(l => l.visible)[0].tint;
    },
    /**
     * @returns {Layer}
     */
    get currentBasemap(){
      return bm.filter(b => b.visible)[0];
    },
    /**
     * @returns {string}
     */
    get currentBasemapId(){
      const cb = bm.filter(b => b.visible)[0];
      return cb && cb.id;
    },
    /**
     * @returns {VectorSource}
     */
    get userDrawingLayer(){
      return ul[0].get('source');
    },
    /**
     * @returns {VectorSource}
     */
    get userGeolocationLayer(){
      return ul[1].get('source');
    },
    /** 
     * Gets flattened list of all basemaps, overlays, layers for storing user defined objects and GPS location
     * @returns {Array<Layer>}
     */
    get flat(){
      const layersToAdd = bm
        .flatMap((b) => b.layers.map((l) => Object.assign(l, {id: b.id, type: 'base', visible: b.visible || false})))
        .concat(om.flatMap((o) => o.layers.map((l) => Object.assign(l, {id: o.id, visible: o.visible || false}))))
        .concat(localUserObjectsLayer)
        .concat(vectorDrawingLayer)
        .concat(userLocationLayer);

      layersToAdd.forEach((l) => l.setVisible(l.visible || false));
      localUserObjectsLayer.setVisible(true);
      vectorDrawingLayer.setVisible(true);
      userLocationLayer.setVisible(true);
      return layersToAdd;
    }
  };
}