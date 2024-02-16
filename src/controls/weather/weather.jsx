import Control from 'ol/control/Control';
import { createStore } from 'solid-js/store';
import { createComponent, createEffect, createSignal,on, Show } from 'solid-js';
import { Config } from './../../config';
import SunCalc from 'suncalc';
import { useService } from 'solid-services';
import { MapContext } from '../../services/mapcontext';


const WeatherComponent = props =>{
  const centerSignal = useService(MapContext)().centerLonLat;
  createEffect(() => setCenter(centerSignal));

  setInterval(async () => await checkWeather(), 3600000);
  let cancellation = new AbortController();
  let cancellationTimeoutId;

  const [center, setCenter] = createSignal(null);
  const [updated, setUpdated] = createSignal(false);

  const checkWeather= async () => {
    setUpdated(false);
    if(centerSignal().length == 0) return;
    const url = `${Config.backend.scheme}://${Config.backend.host}/v3/weather/point/${center()[1].toFixed(2)},${center()[0].toFixed(2)}`;
    if(cancellation){
      clearTimeout(cancellationTimeoutId);
      if(!cancellation.signal.aborted) cancellation.abort();
      cancellation = new AbortController();
      cancellationTimeoutId = setTimeout(()=> cancellation.abort(), 15000);
    }
    fetch(url, {
      signal: cancellation.signal,
      priority: 'low'
    }).then(response => {
      clearTimeout(cancellationTimeoutId);
      if(response.ok){
        response.text().then(text => {
          setWeather(JSON.parse(text));
          setUpdated(true);
        });
      }
    }).catch();
  };

  const [weather, setWeather] = createStore({
    tempSurface: null,
    windSurfaceSpeed: null,
    windSurfaceDir: 0,
    windSurfaceGust: null,
    rain3h: null,
    rainType: null,
    cloudPercent: null,
    isFog: false
  });

  createEffect(on(center,async ()=> await checkWeather()));
  const tempSurface = () => {
    const t = weather.tempSurface;
    if(t == null) return '';
    const temp = t.toFixed(0) === '-0' ? '0' : t.toFixed(0);
    return `${temp.replace('-','–')}°`;
  };
  const windSurface = () => {
    const wind = weather.windSurfaceSpeed;
    const gust = weather.windSurfaceGust;
    if(wind == null || gust == null) return '';
    return `${wind.toFixed(0)}${gust > (wind + 1) ? `–${gust.toFixed(0)}` : ''} м/c`;
  };

  const rain = () => {
    if (!weather.rain3h)
      return '';
    if (weather.rain3h > 0.05) {
      let retval = `${weather.rainType}`;
      if (weather.rainType !== 'снег') {
        retval += ` ${weather.rain3h.toFixed(1)} мм / 3ч`;
      }
      return retval;
    }
    else
      return '';
  };
  const windSurfaceRotation = () => `rotate(${weather.windSurfaceDir}deg)`;
  
  const clouds = () => (weather.cloudPercent / 100).toFixed(2);

  const hasSun = () => {
    if (SunCalc && center()) {
      const currentTime = new Date();
      const sunTimes = SunCalc.getTimes(currentTime, center()[1], center()[0]);
      return currentTime >= sunTimes.dawn && currentTime <= sunTimes.dusk
        || SunCalc.getPosition(new Date(), center()[1], center()[0]).altitude > 0;
    }
    return false;
  };
  const hasMoon = () => {
    if (SunCalc && center()) {
      return SunCalc.getMoonPosition(new Date(), center()[1], center()[0]).altitude > -0.1;
    }
    return false;
  };
  const hasFog = () => (weather.isFog ? 'туман' : '');

  return (
    <div class={`${props.classes} container`}>
      <Show when={updated}>
        <div style={{'width': '24px', 'height': '24px'}}>
          <svg class="icon sun" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{visibility: hasSun() ? 'visible': 'hidden'}}>
            <path d="M12 7.5C12 9.98528 9.98528 12 7.5 12C5.01472 12 3 9.98528 3 7.5C3 5.01472 5.01472 3 7.5 3C9.98528 3 12 5.01472 12 7.5Z" fill="currentColor"/>
            <path d="M7 13H8V15H7V13Z" fill="currentColor"/>
            <path d="M7 0H8V2H7V0Z" fill="currentColor"/>
            <path d="M0 7H2V8H0V7Z" fill="currentColor"/>
            <path d="M13 7H15V8H13V7Z" fill="currentColor"/>
            <path d="M1.84314 12.4498L3.25735 11.0356L3.96446 11.7427L2.55025 13.1569L1.84314 12.4498Z" fill="currentColor"/>
            <path d="M11.0355 3.25739L12.4497 1.84317L13.1568 2.55028L11.7426 3.96449L11.0355 3.25739Z" fill="currentColor"/>
            <path d="M2.55029 1.84314L3.96451 3.25735L3.2574 3.96446L1.84319 2.55025L2.55029 1.84314Z" fill="currentColor"/>
            <path d="M11.7426 11.0356L13.1568 12.4498L12.4497 13.1569L11.0355 11.7427L11.7426 11.0356Z" fill="currentColor"/>
          </svg>
          <svg class='icon moon' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{visibility: hasMoon() ? 'visible': 'hidden'}}>
            <path d="M17.0215 10.5215C19.5068 10.5215 21.5215 8.50677 21.5215 6.02149C21.5215 5.29451 21.3491 4.6078 21.043 4C22.513 4.74041 23.5215 6.26318 23.5215 8.02149C23.5215 10.5068 21.5068 12.5215 19.0215 12.5215C17.2632 12.5215 15.7404 11.513 15 10.043C15.6078 10.3491 16.2945 10.5215 17.0215 10.5215Z" fill="currentColor"/>
          </svg>
          <svg class='icon cloud' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{opacity: clouds()}}>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7 10.4C14.2131 10.4 13.7429 10.471 13.299 10.6033C12.1845 9.60622 10.713 9 9.09998 9C6.22252 9 3.79563 10.9291 3.04204 13.5645C1.25714 14.2965 0 16.0514 0 18.1C0 20.5686 1.8254 22.6107 4.20002 22.9504V23H19.6V22.9504C21.9746 22.6107 23.8 20.5685 23.8 18.1C23.8 15.4712 21.7299 13.326 19.131 13.2054C18.3456 11.547 16.6568 10.4 14.7 10.4Z" fill="currentColor"/>
          </svg>
        </div>
        <div class='weather-info' style={{display: 'flex', 'flex-direction': 'column'}}>
          <div> 
            <span>{tempSurface()}</span><span>{windSurface()}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              transform: windSurfaceRotation(), 
              visibility: windSurface() == '' ? 'hidden': 'visible',
              'vertical-align': 'text-bottom'
            }}>
              <path d="M7 11.5L11 2.00729L6.99546 4.70254L3 2L7 11.5Z" fill='currentColor'/>
            </svg>

          </div>
          <div> 
            <span>{rain()}</span><span>{hasFog()}</span>
          </div>
        </div>
      </Show>
    </div>
  );
};

export class Weather extends Control {
  constructor(options) {
    options = options || {};
    const element = createComponent(WeatherComponent, {
      classes: options.className || 'gis-weather'
    });
      
    super({
      element: element(),
      target: options.target || undefined,
    });
  }
}