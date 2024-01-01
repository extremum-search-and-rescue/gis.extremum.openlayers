import { createSignal } from 'solid-js';

export function MapContext() {
  const [getMap, setMap] = createSignal();
  return {
    get map() {
      return getMap;
    },
    set map(map){
      setMap(map);
    }
  };
}