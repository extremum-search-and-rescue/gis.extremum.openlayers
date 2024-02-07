import { createStore } from 'solid-js/store';
import { useService } from 'solid-services';
import { MapContext } from './mapcontext';
import { Vector as VectorSource } from 'ol/source.js';
import EventType from 'ol/events/EventType.js';
import { CollectionEvent } from 'ol/Collection';
import { Icon, Style } from 'ol/style.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Map } from 'ol';

/**
 * Changes html class of map container to propagate classes to child controls for adaptation of map tint
 * @param {Map} map 
 * @param {import('ol/layer.js').Layer} bm 
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

let windowStyles = window.getComputedStyle(document.body);

const gisColorPalette = [
  ['--blue-600','fff'],
  ['--blue-400','000'],
  ['--blue-800','fff'],
  ['--red-600', 'fff'],
  ['--red-300', '000'],
  ['--red-800', 'fff'],
  ['--orange-500', 'fff'],
  ['--orange-700', 'fff'],
  ['--brown-300', '000'],
  ['--brown-900', 'fff'],
  ['--yellow-300', '00'],
  ['--olive-600','fff'],
  ['--olive-900','fff'],
  ['--grass-300', '000'],
  ['--grass-600', 'fff'],
  ['--grass-900', 'fff'],
  ['--green-600', 'fff'],
  ['--purple-300', '000'],
  ['--purple-700', 'fff'],
  ['--violet-600','fff'],
  ['--violet-900','fff'],
  ['--gray-400','fff'],
  ['--gray-900','fff'],
  ['--bluegray-500','fff'],
  ['--bluegray-800','fff'],
].map(colorPair => 
  [
    windowStyles.getPropertyValue(colorPair[0]).replace('#',''), 
    colorPair[1]
  ]
);

let customLeafletColorId = 0;
function customGetNextColorPair() {
  let neededColor = gisColorPalette[customLeafletColorId];
  customLeafletColorId++;

  if (customLeafletColorId === gisColorPalette.length) {
    customLeafletColorId = 0;
  }
  return neededColor;
}
const createMarkerStyle = function(feature, resolution){
  let colorPair = [feature.get('color'), feature.get('outline') || 'fff'];
  if(!colorPair[0]){
    colorPair = customGetNextColorPair();
    feature.set('color', colorPair[0]);
    feature.set('outline', colorPair[1]);
  }
  const iconTemplate = `data:image/svg+xml,%3Csvg width='37' height='42' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d)'%3E%3Cpath d='M17.3 38c5.9-.76 22.1-12.37 12.97-12.98-9.11-.6-14.67 11.7-12.96 12.98z' fill='%23000' fill-opacity='.05'/%3E%3C/g%3E%3Cg filter='url(%23filter1_d)'%3E%3Cpath d='M28 13.37c0 6.28-9.17 22.26-11 24.63-1.83-2.37-11-18.35-11-24.63C6 7.09 10.92 2 17 2s11 5.09 11 11.37z' fill='%23${colorPair[1]}'/%3E%3C/g%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M26.47 19.15C27.43 16.61 28 14.46 28 13a11 11 0 00-22 0c0 1.46.57 3.61 1.53 6.15.95 2.5 2.24 5.28 3.61 7.94 2.2 4.29 4.54 8.2 5.86 10.18 1.32-1.98 3.66-5.9 5.86-10.18a80.95 80.95 0 003.61-7.94zm-8.86 19C20.51 33.91 29 19.11 29 13a12 12 0 00-24 0c0 6.1 8.49 20.9 11.39 25.15.25.37.45.65.61.85.16-.2.36-.48.61-.85z' fill='url(%23paint0_linear)'/%3E%3Cpath d='M28 13.12c0 6.13-9.17 21.76-11 24.08-1.83-2.32-11-17.95-11-24.08C6 6.98 10.92 2 17 2s11 4.98 11 11.12z' fill='url(%23paint1_linear)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M25.6 18.8c.89-2.36 1.4-4.34 1.4-5.68C27 7.52 22.51 3 17 3S7 7.52 7 13.12c0 1.34.51 3.32 1.4 5.67a75.34 75.34 0 003.3 7.35c1.98 3.9 4.08 7.45 5.3 9.32 1.22-1.87 3.32-5.43 5.3-9.32a75.34 75.34 0 003.3-7.35zm-8 17.55C20.32 32.32 28 18.74 28 13.12 28 6.98 23.08 2 17 2S6 6.98 6 13.12c0 5.62 7.69 19.2 10.4 23.23.24.37.45.66.6.85.15-.2.36-.48.6-.85z' fill='url(%23paint2_linear)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M23 13a6 6 0 11-12 0 6 6 0 0112 0zm-6 4.8a4.8 4.8 0 100-9.6 4.8 4.8 0 000 9.6z' fill='url(%23paint3_linear)'/%3E%3Cpath d='M21.5 13a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z' fill='%23fff' stroke='%23${colorPair[0]}'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='17' y1='1' x2='17' y2='39' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23${colorPair[0]}' stop-opacity='.85'/%3E%3Cstop offset='1' stop-color='%23${colorPair[0]}'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear' x1='17' y1='2' x2='17' y2='37.2' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.23' stop-color='%23${colorPair[0]}' stop-opacity='.85'/%3E%3Cstop offset='.39' stop-color='%23${colorPair[0]}' stop-opacity='.9'/%3E%3Cstop offset='1' stop-color='%23${colorPair[0]}'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear' x1='17' y1='2' x2='17' y2='37.2' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFF' stop-opacity='.6'/%3E%3Cstop offset='1' stop-color='%23FFF' stop-opacity='.4'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear' x1='17' y1='7' x2='17' y2='19' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23${colorPair[1]}' stop-opacity='.3'/%3E%3Cstop offset='1' stop-color='%23${colorPair[1]}' stop-opacity='.15'/%3E%3C/linearGradient%3E%3Cfilter id='filter0_d' x='13' y='21' width='24' height='21' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3Cfilter id='filter1_d' x='4' y='0' width='26' height='40' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E`;
  return new Style({
    image: new Icon({
      src: iconTemplate,
      anchor: [0.5,1],
      scale: resolution < 15 ? 1 : 0.5,
      anchorYUnits: 'fraction',
      anchorXUnits: 'pixels'
    })
  });
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
    /**
     * Adds array of any features
     * @param {Array<import('ol/feature/feature.js').Feature>} features 
     * @param {Map} map 
     * @param {boolean?} fitMap
     */
    addFeatures(features, map, fitMap = true)
    {
      const source = localUserObjectsLayer.get('source');
      source.addFeatures(features);
      if(fitMap) map.getView().fit(source.getExtent());
    },
    /**
     * Adds Point feature with marker style
     * @param {Feature} feature 
     * @param {Map} map 
     * @param {boolean?} fitMap 
     */
    addMarker(feature, map, fitMap = true) {
      const source = localUserObjectsLayer.get('source');
      feature.setStyle(createMarkerStyle);
      source.addFeatures([feature]);
      if(fitMap) map.getView().fit(source.getExtent());
    },

    /**
     * @returns {Array<import('ol/layer.js').Layer>}
     */
    get basemaps() {
      return bm;
    },
    /**
     * @param {Array<import('ol/layer.js').Layer>} basemaps 
     */
    set basemaps(basemaps){
      setBm(basemaps);
    },
    /**
     * @returns {Array<import('ol/layer.js').Layer>}
     */
    get overlays() {
      return om; 
    },
    /**
     * @param {Array<import('ol/layer.js').Layer>} overlays 
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
     * @returns {import('ol/layer.js').Layer}
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
     * @returns {Array<import('ol/layer.js').Layer>}
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
      return layersToAdd.sort(l => l.zIndex);
    }
  };
}