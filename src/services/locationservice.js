import { createSignal } from 'solid-js';

export function LocationService()
{   
  const [active, setActive] = createSignal(false);
  const [locating, setLocating] = createSignal(false);
  const [location, setLocation] = createSignal(null);
  const [error, setError] = createSignal(null);

  let watchId;
  function toggleWatch(enable){
    if(enable){
      setActive(true);
      setLocating(true);
      watchId = navigator.geolocation.watchPosition(
        geolocationFn,
        errorFn,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        });
    }
    else {
      navigator.geolocation.clearWatch(watchId);
      setActive(false);
      setLocation(null);
      setError(null);
      setLocating(false);
    }
  }
  function geolocationFn(pos){
    setLocation(pos);
    setError(null);
    setLocating(false);
  }
  function errorFn(err){
    setError(err);
  }
  return {
    locating: locating,
    location: location,
    active: active,
    error: error,
    toggle()
    {
      if(locating()==true || location()){
        toggleWatch(false);
      }
      else {
        toggleWatch(true);
      }
    }
  };
}