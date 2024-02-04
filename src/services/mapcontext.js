import { createSignal } from 'solid-js';

export function MapContext() {
  const [getMap, setMap] = createSignal();
  return {
    /** @returns {import('ol/Map').Map} */
    get map() {
      return getMap;
    },
    /** @param {import('ol/Map').Map} map  */
    set map(map){
      setMap(map);
    }
  };
}