import { createSignal } from 'solid-js';
import { toLonLat } from 'ol/proj';

export function MapContext() {
  const [getMap, setMap] = createSignal();
  const [center, setCenter] = createSignal([]);
  const onCenterChanged = () => {
    const newC = toLonLat(getMap().getView().getCenter());
    setCenter(newC);
  };
  return {
    /** @returns {import('ol/Map').Map} */
    get map() {
      return getMap;
    },
    /** @param {import('ol/Map').Map} map  */
    set map(map){
      const oldMap = getMap();
      if(oldMap){
        oldMap.un('moveend', onCenterChanged);
      }
      setMap(map);
      map.on('moveend', onCenterChanged);
    },
    centerLonLat: center,
  };
}