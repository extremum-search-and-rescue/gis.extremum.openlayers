import Control from 'ol/control/Control';
import { toLonLat } from 'ol/proj';
import { createComponent, createEffect, createSignal, Show } from 'solid-js';
import SunCalc from 'suncalc';
import Config from '../../config';
import './suncalc.css';
import { createElementBounds } from '@solid-primitives/bounds';
import { useService } from 'solid-services';
import { MapContext } from '../../services/mapcontext';
import tzlookup from 'tz-lookup';
import { zeroPad } from '../../utils/nums';
import { addMinutes } from '../../utils/dates';


const [rotationRad, setRotationRad] = createSignal(0);
const controlMargin = 20;
let suncalcStyle;

const TimeLabel = props => {
  const date = ()=> (props.date && props.date()) 
  || getDateForHour(props.hour + props.timeOffetMinutes()/60, props.startTime && props.startTime());

  const valid = () => date() instanceof Date && !isNaN(date()) 
    && date() >= props.startTime()  
    && date() <= props.endTime();
  
  let position = () => SunCalc.getPosition(date(), props.center()[1], props.center()[0]);
  let xy = () => getXY(position(), -16, 32, props.circleSize());
  
  const localDate = () => valid() && new Date(date().getTime() + (props.timeOffetMinutes() * 60 * 1000));
  const localDateFormatted = () => valid() && `${zeroPad(localDate().getHours(),2)}:${zeroPad(localDate().getMinutes(),2)}`;
  const shaded = () => position().altitude < -0.1 ? ' suncalc-shaded' : '';
  return (
    <Show when={valid()}>
      <text class={`suncalc-sun-label${shaded()}`} x={xy()[0]} y={xy()[1]}>{localDateFormatted()}</text>
    </Show>
  );
};

const Moon = props => {
  let moonX = () => props.circleSize()/2 + (props.circleSize()/2 - (props.circleSize() / 4 + props.radius) * props.position().altitude) * Math.cos(props.position().azimuth + rotationRad() + Math.PI / 2);
  let moonY = () => props.circleSize()/2 + (props.circleSize()/2 - (props.circleSize() / 4 + props.radius) * props.position().altitude) * Math.sin(props.position().azimuth + rotationRad() + Math.PI / 2);  
  let moonVisible = () => props.position().altitude > -0.1;
  return (
    <Show when={moonVisible()}>
      <circle class="suncalc-moon" cx={moonX()} cy={moonY()} r='6' opacity={props.illumination()} />
    </Show>
  ); 
};

const Sun = props => {
  let sunVisible = () => (new Date() >= props.dawn() && new Date() <= props.dusk()) || props.sunPosition().altitude > 0;

  let sunX = () => props.circleSize()/2 + (props.circleSize()/2 - (props.circleSize()/4 + props.radius) * props.sunPosition().altitude) * Math.cos(props.sunPosition().azimuth + rotationRad() + Math.PI / 2);
  let sunY = () => props.circleSize()/2 + (props.circleSize()/2 - (props.circleSize()/4 + props.radius) * props.sunPosition().altitude) * Math.sin(props.sunPosition().azimuth + rotationRad() + Math.PI / 2);
  
  return (
    <Show when={sunVisible()}>
      <circle class='suncalc-sun' cx={sunX()} cy={sunY()} r='13' id='suncalc-sun'/>
    </Show>
  );
};

function getDateForHour(hour, startTime) {
  startTime = new Date();
  hour ??= 0;
  return new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), hour, 0);
}


function calculateTimeOffset(date, lonlat) {
  const mapcenterTimezone = tzlookup(lonlat[1], lonlat[0]);
  const mapcenterDate = new Date(date.toLocaleString('en-US', { timeZone: mapcenterTimezone }));
  return Math.round((mapcenterDate.getTime() - date.getTime()) / (1000 * 60));
}

function getXY(position,controlMargin, modificator, circleSize) {
  const retval = [0,0];
  const offset = modificator ? modificator : 0;
  if(!circleSize) throw new RangeError('circleSize is empty');
  retval[0] = Math.round((circleSize / 2 + controlMargin) + ((circleSize / 2 + offset) * Math.cos(position.azimuth + rotationRad() +  Math.PI / 2)));
  retval[1] = Math.round((circleSize / 2 + controlMargin) + ((circleSize / 2 + offset) * Math.sin(position.azimuth  + rotationRad()+ Math.PI / 2)));
  return retval;
}

const SunPathCircle = props => {
  let sunPathCenter = () => props.circleSize()/2;
  let points = () => getPathClipPoints(props.sunrise(), props.sunset(), SunCalc.getPosition, props.center(), 13 * 2 + 4, props.circleSize()).join(' ');
  return (
    <>
      <clipPath id="mask1"><polygon points={points()} /></clipPath>
      <circle class="suncalc-sun-path" clip-path="url(#mask1)" id="sunPath" cx={sunPathCenter()+2} cy={sunPathCenter()+2} r={sunPathCenter() + 4}/>
    </>);
};

//FIXME replace by arc
//https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function getPathClipPoints(dawn, dusk, positionFunction, lonlat, offset, circleSize) {
  const points = [];
  const xy = getXYforTimes(getTimesFromDuskTillDown(dawn, dusk), positionFunction, lonlat, offset, circleSize);
  for (let i = 0; i < xy.length; i++) {
    points.push(`${xy[i][0]},${xy[i][1]}`);
  }
  points.push(`${circleSize / 2 },${circleSize /2}`);
  return points;
}
function getTimesFromDuskTillDown(start, end) {
  const times = [];
  start = start instanceof Date && !isNaN(start) ? start : getDateForHour(0, start);
  end = end instanceof Date && !isNaN(end) ? end : getDateForHour(23, start);
  if (start > end)
    end = end.addDays(1);
  for (let date = start; date <= end; date = addMinutes(date,5)) {
    times.push(date);
  }
  return times;
}
function getXYforTimes(times, positionFunction, lonlat, offset, circleSize) {
  const xy = [];
  for (let i = 0; i < times.length; i++) {
    xy.push(getXY(positionFunction(times[i], lonlat[1], lonlat[0]), 0, 20, circleSize));
  }
  return xy;
}

const SunmoonCircleComponent = () => {
  const getMapContext = useService(MapContext);

  const [center, setCenter] = createSignal();

  const [timeOffetMinutes, setTimeOffsetMinutes] = createSignal(0);

  // eslint-disable-next-line solid/reactivity
  SunmoonCircleComponent.placeChanged = function(view) {
    const center = toLonLat(view.get('center'));
    setCenter(center);
    setTimeOffsetMinutes(calculateTimeOffset(new Date(), center));

    if(!suncalcStyle) {
      suncalcStyle = document.getElementById('suncalc-container').style;
    }
  };
  setCenter(toLonLat(window.View && window.View.center || Config.center));

  let sunPosition = () => SunCalc.getPosition(new Date(), center()[1], center()[0]);
  let moonPosition = () => SunCalc.getMoonPosition(new Date(), center()[1], center()[0]);
  let moonIllumination = () => SunCalc.getMoonIllumination(new Date()).fraction.toFixed(2);

  let sunTimes = () => SunCalc.getTimes(new Date(), center()[1], center()[0]);
  let dawn = () => sunTimes()['dawn'];
  let sunrise = () => sunTimes()['sunrise'];
  let sunset = () => sunTimes()['sunset'];
  let dusk = ()=> sunTimes()['dusk'];

  let bounds = createElementBounds(document.querySelector(`#${getMapContext().map().get('target')}`), { 
    trackMutation: false, 
    trackScroll: false, 
    trackResize: true
  });
  createEffect(()=> bounds);
  
  let circleSize = () => Math.min(Math.min(bounds.width, bounds.height) - 80, 480);
  let fullControlSize = () => circleSize() + controlMargin * 2;
  let viewBox = () => `0 0 ${fullControlSize()} ${fullControlSize()}`;

  /* 
  const moonPathClip = `<clipPath id="mask2"><polygon points="${this.getPathClipPoints(moonTimes['rise'], moonTimes['set'], SunCalc.getMoonPosition, lonlat, moonRadius * 2 + 4).join(' ')}" /></clipPath>`;

  const moonPathCircle = `${moonPathClip}<circle class="gis-themeaware suncalc-moon-path ${theme}" clip-path="url(#mask2)" cx="${halfSize}" cy="${halfSize}" r="${halfSize - 4}" id="moonPath"/>`;
  const timeDifferenceLabel = (() => {
    let retval;
    if (Math.abs(timeOffetMinutes) !== 0) {
      let minutes = 0;
      let sign = timeOffetMinutes < 0 ? '-' : '+';
      let hours = this.timeOffetMinutes / 60;
      if (hours !== Math.round(hours)) {
        minutes = Math.abs((Math.abs(Math.round(hours)) - Math.abs(hours))) * 60;
      }
      retval = `<text class="suncalc-sun-label ${theme}" x="${halfSize + 16}" y="${halfSize - 4}">${sign}${Math.abs(Math.round(hours)).pad(2)}:${minutes.pad(2)}</text>`;
    }
    return retval;
  })();

  function polylineForTimeAndPlace(time, lonlat, cssclass, timeEnd, tooltipContent) {
    if (!isValidDate(time) || !isValidDate(timeEnd))
      return '';
    const x = this.halfSize * Math.cos(SunCalc.getPosition(time, lonlat[1], lonlat[0]).azimuth + Math.PI / 2);
    const y = this.halfSize * Math.sin(SunCalc.getPosition(time, lonlat[1], lonlat[0]).azimuth + Math.PI / 2);
    const titleTag = typeof tooltipContent !== 'undefined' ? `<title>${tooltipContent}</title>` : '';
    if (timeEnd) {
      const x1 = this.halfSize * Math.cos(SunCalc.getPosition(timeEnd, lonlat[1], lonlat[0]).azimuth + Math.PI / 2);
      const y1 = this.halfSize * Math.sin(SunCalc.getPosition(timeEnd, lonlat[1], lonlat[0]).azimuth + Math.PI / 2);
      return `<polyline class="suncalc-${cssclass}" points='${this.halfSize},${this.halfSize} ${this.halfSize + Math.round(x)},${this.halfSize + Math.round(y)} ${300 + Math.round(x1)},${300 + Math.round(y1)}'>${titleTag}</polyline>`;
    }
    else
      return `<polyline class="suncalc-${cssclass}" points='${this.halfSize},${this.halfSize} ${this.halfSize + Math.round(x)},${this.halfSize + Math.round(y)}'>${titleTag}</polyline>`;
  }
*/

  /*
<svg class="suncalc" width={bounds.width} height={bounds.height} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={`0 0 ${bounds.width} ${bounds.height}`}>
        timeDifferenceLabel,
    </svg>
*/

  return (
    <svg id={'suncalc-container'} width={fullControlSize()} height={fullControlSize()} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={viewBox()}>
      <svg id={'suncalc-circle'} x={controlMargin} y={controlMargin} class="suncalc-circle" width={fullControlSize()} height={fullControlSize()} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={viewBox()}>
        <g filter="url(#filter1_d)">
          <circle class="suncalc-azimuth-circle" id="azimuthCircle" cx={circleSize()/2+2} cy={circleSize()/2+2} r={circleSize()/2}/>
        </g>
        <SunPathCircle sunrise={sunrise} sunset={sunset} center={center} circleSize={circleSize}/>
        <TimeLabel date={sunrise} startTime={dawn} endTime={dusk} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel date={dawn} startTime={dawn} endTime={dusk} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel date={dusk} startTime={dawn} endTime={dusk} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel date={sunset} startTime={dawn} endTime={dusk} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={0} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={3} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={6} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={9} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={12} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={15} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={18} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
        <TimeLabel hour={21} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} center={center} circleSize={circleSize}/>
      </svg>

      <svg id={'suncalc'} x={controlMargin} y={controlMargin} class="suncalc" width={fullControlSize()} height={fullControlSize()} xmlns="http://www.w3.org/2000/svg" overflow="visible">
        <defs>
          <filter id="filter1_d" x="0" y="0" width={fullControlSize()} height={fullControlSize()} filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="5"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
        </defs>
        <Moon radius={6} position={moonPosition} illumination={moonIllumination} circleSize={circleSize}/>
        <Sun circleSize={circleSize} radius={13} dawn={dawn} dusk={dusk} sunPosition={sunPosition}/>
      </svg>
    </svg>
  );
};

export class SunmoonCircle extends Control {
  constructor(options) {
    options = options || {};
    const element = createComponent(SunmoonCircleComponent);
  
    super({
      element: element(),
      target: options.target || undefined,
    });
  }
  render(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!frameState) {
      return;
    }
    const rotation = frameState.viewState.rotation;
    if (rotation != this.rotation_) {
      setRotationRad(rotation);
    }
    this.rotation_ = rotation;
  }
  setMap(map){
    super.setMap(map);
    this._map = map;
    this._map.on('moveend', (event) => SunmoonCircleComponent.placeChanged(event.map.getView()));
  }
}