import { createStore } from 'solid-js/store';
import { useService } from 'solid-services';
import { MapContext } from './mapcontext';
import { Vector as VectorSource } from 'ol/source.js';
import { Vector as VectorLayer } from 'ol/layer.js';

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
    get basemaps() {
      return bm;
    },
    set basemaps(basemaps){
      setBm(basemaps);
    },
    get overlays() {
      return om; 
    },
    set overlays(overlays) {
      setOm(overlays);
    },
    toggleOverlay(id, checked, map) {
      setOm(l => l.id === id , 'visible', checked );
      const currentMap = map ?? getMapcontext().map();
      
      currentMap
        .getAllLayers()
        .filter(l =>l.id === id)
        .forEach(l => l.setVisible(checked));
    },
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
    get mapTint(){
      return bm.filter(b => b.visible)[0].layers.filter(l => l.visible)[0].tint;
    },
    get currentBasemap(){
      return bm.filter(b => b.visible)[0];
    },
    get currentBasemapId(){
      const cb = bm.filter(b => b.visible)[0];
      return cb && cb.id;
    },
    get userDrawingLayer(){
      return ul[0].get('source');
    },
    get userGeolocationLayer(){
      return ul[1].get('source');
    },
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