import Control from 'ol/control/Control';
import { Switch, createComponent, createEffect, createSignal, Match } from 'solid-js';
import { useService } from 'solid-services';
import { LocationService } from '../../services/locationservice';
import { LayerService } from '../../services/layerservice';
import { fromLonLat } from 'ol/proj';
import { MapContext } from '../../services/mapcontext';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { circular } from 'ol/geom/Polygon';

const LocateComponent = props =>{
  const locationService = useService(LocationService);
  const layerservice = useService(LayerService);
  const mapContext = useService(MapContext);
  const userLayer = layerservice().userGeolocationLayer;

  const [location, setLocation] = createSignal(null);
  const [error, setError] = createSignal(null);
  const [locating, setLocating] = createSignal(false);
  const [active, setActive] = createSignal(false);
    
  createEffect(()=>{
    setError(null);
    setLocation(locationService().location());
    drawUserLocation(locationService().location());
  });
  createEffect(()=> {
    setLocation(null);
    setError(locationService().error()); 
  });
  createEffect(()=> {
    setLocation(null); setError(null);
    setLocating(locationService().locating());
  });
  createEffect(()=> {
    setActive(locationService().active());
  });
  let userPositionFeatures;
  function drawUserLocation(pos){
    if(!pos) {
      if(userPositionFeatures) {
        userLayer.clear(true);
        userPositionFeatures = null;
      }
      return;
    }
        
    const lonLat = [pos.coords.longitude, pos.coords.latitude];
    const acc = circular(lonLat, pos.coords.accuracy);
    //expensive operation with complex polygon instead of circle
    const radiusGeometry = acc.transform('EPSG:4326', mapContext().map().getView().getProjection());
    const coordinates = fromLonLat(lonLat);
    if(!userPositionFeatures){
      userPositionFeatures = [
        new Feature(radiusGeometry),
        new Feature(new Point(coordinates))
      ];
      userLayer.addFeatures(userPositionFeatures);
      mapContext().map().getView().fit(
        userLayer.getExtent(),
        {
          maxZoom: 15,
          duration: 500
        });
    }
    else
    {
      userPositionFeatures[0].setGeometry(radiusGeometry);
      userPositionFeatures[1].getGeometry().setCoordinates(coordinates);
    }
  }
  return (
    <div class={props.classes && ' gis-control-toolbar'}>
      <button aria-pressed={active() || locating()} class={'gis-toolbar-button'} onClick={() => locationService().toggle()}>
        <Switch>
          <Match when={!locating()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6588 1.73935L8.64931 14.7598C8.51451 15.0519 8.07692 14.9558 8.07692 14.6341V8.22309C8.07692 8.0574 7.94261 7.92309 7.77692 7.92309H1.36589C1.04421 7.92309 0.948102 7.48551 1.24017 7.3507L14.2607 1.34125C14.5139 1.22437 14.7756 1.48611 14.6588 1.73935Z" fill="currentColor" />
            </svg>
          </Match>
          <Match when={locating()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6588 1.73935L8.64931 14.7598C8.51451 15.0519 8.07692 14.9558 8.07692 14.6341V8.22309C8.07692 8.0574 7.94261 7.92309 7.77692 7.92309H1.36589C1.04421 7.92309 0.948102 7.48551 1.24017 7.3507L14.2607 1.34125C14.5139 1.22437 14.7756 1.48611 14.6588 1.73935Z" fill="gray" />
            </svg>
          </Match>
          <Match when={location()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6588 1.73935L8.64931 14.7598C8.51451 15.0519 8.07692 14.9558 8.07692 14.6341V8.22309C8.07692 8.0574 7.94261 7.92309 7.77692 7.92309H1.36589C1.04421 7.92309 0.948102 7.48551 1.24017 7.3507L14.2607 1.34125C14.5139 1.22437 14.7756 1.48611 14.6588 1.73935Z" fill="blue" />
            </svg>
          </Match>
          <Match when={error()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6588 1.73935L8.64931 14.7598C8.51451 15.0519 8.07692 14.9558 8.07692 14.6341V8.22309C8.07692 8.0574 7.94261 7.92309 7.77692 7.92309H1.36589C1.04421 7.92309 0.948102 7.48551 1.24017 7.3507L14.2607 1.34125C14.5139 1.22437 14.7756 1.48611 14.6588 1.73935Z" fill="red" />
            </svg>
          </Match>
        </Switch>
      </button>
    </div>);
};

export class Locate extends Control
{
  _map = null;
  constructor(options)
  {
    const opts = options || {};
    const params = {
      classes: opts.className
    };
    const element = createComponent(LocateComponent, params);
    super({
      element: element(),
      target: opts.target || undefined
    });
  }
  setMap(map){
    super.setMap(map);
    this._map = map;
  }
}