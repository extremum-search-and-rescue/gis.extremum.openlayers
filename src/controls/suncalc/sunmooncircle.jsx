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

let [rotation, setRotation] = createSignal();
let [center, setCenter] = createSignal();
let suncalcStyle;

function placeChanged(event) {
  const view = event.map.getView();
  setRotation(Math.round(360+(-90+(view.get('rotation') * 180 / Math.PI)) % 360));
  setCenter(toLonLat(view.get('center')));

  if(!suncalcStyle)
    suncalcStyle = document.getElementById('suncalc').style;
  suncalcStyle.transform = `rotate(${rotation()}deg)`;
}

const TimeLabel = props => {
  const date = props.date || getDateForHour(props.hour, props.startTime);

  const valid = date instanceof Date && !isNaN(date) 
    && date >= props.startTime  
    && date <= props.endTime;
  const position = props.positionFn(date, props.lat, props.lon);

  const localDate = new Date(date.getTime() + (props.timeOffetMinutes * 60 * 1000));
  const localDateFormatted = `${zeroPad(localDate.getHours(),2)}:${zeroPad(localDate.getMinutes(),2)}`;
  const xy = getXY(position, props.controlMargin, props.circleSize, 20);
  const classes = `${props.cls}${position.altitude < -0.1 ? ` ${props.shadedCls}` : ''}`;
  return (
    <Show when={valid}>
      <text class={classes} x={xy[0]} y={xy[1]}>{localDateFormatted}</text>
    </Show>
  );
};

const MoonCircle = props => {
  return (
    <circle class="suncalc-moon" cx={props.x} cy={props.y} r={props.radius} opacity={props.opacity} />
  ); 
};

const SunCircle = props => {
  const sunX = props.halfSize + (props.halfSize - (props.halfSize / 2 + props.radius) * props.sunPosition.altitude) * Math.cos(props.sunPosition.azimuth + Math.PI / 2);
  const sunY = props.halfSize + (props.halfSize - (props.halfSize / 2 + props.radius) * props.sunPosition.altitude) * Math.sin(props.sunPosition.azimuth + Math.PI / 2);
  //const sunAzimuth = polylineForTimeAndPlace(currentTime, lonlat, 'azimuth');
  return (
    <g filter="url(#filter0_d)">
      <circle class="suncalc-sun" cx={sunX} cy={sunY} r={props.radius} id="suncalc-sun"/>
    </g>
  );
};

function getDateForHour(hour, startTime) {
  return new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), hour, 0);
}

function calculateTimeOffset(date, lonlat){
  {
    const mapcenterTimezone = tzlookup(lonlat[1], lonlat[0]);
    const mapcenterDate = new Date(date.toLocaleString('en-US', { timeZone: mapcenterTimezone }));
    return Math.round((mapcenterDate.getTime() - date.getTime()) / (1000 * 60));
  }
}



function getXY(position,controlMargin, circleSize, modificator) {
  const retval = [0,0];
  const offset = modificator ? modificator : 0;
  retval[0] = Math.round((circleSize / 2 + controlMargin) + ((circleSize / 2 + offset) * Math.cos(position.azimuth + Math.PI / 2)));
  retval[1] = Math.round((circleSize / 2 + controlMargin) + ((circleSize / 2 + offset) * Math.sin(position.azimuth + Math.PI / 2)));
  return retval;
}

const AzmimuthCircle = props => {
  <g filter="url(#filter1_d)">
    <circle class="suncalc-azimuth-circle" id="azimuthCircle" cx={props.halfSize} cy={props.halfSize} r={props.halfSize}/>
  </g>;
};
const SunPathCircle = props => {
  const points = `${getPathClipPoints(props.sunrise, props.sunset, SunCalc.getPosition, props.lonlat, 13 * 2 + 4).join(' '),props.halfSize}`;
  return (
    <>
      <clipPath id="mask1"><polygon points={points} /></clipPath>
      <circle class="suncalc-sun-path" clip-path="url(#mask1)" id="sunPath" cx={props.halfSize} cy={props.halfSize} r={props.halfSize + 4}/>
    </>);
};
function getPathClipPoints(dawn, dusk, positionFunction, lonlat, offset, halfSize) {
  const points = [];
  const xy = getXYforTimes(getTimesFromDuskTillDown(dawn, dusk), positionFunction, lonlat, offset);
  for (let i = 0; i < xy.length; i++) {
    points.push(`${xy[i][0]},${xy[i][1]}`);
  }
  points.push(`${halfSize},${halfSize}`);
  return points;
}
function getTimesFromDuskTillDown(start, end) {
  const times = [];
  start = start instanceof Date && !isNaN(start) ? start : getDateForHour(0, start);
  end = end instanceof Date && !isNaN(end) ? end : getDateForHour(23, start);
  if (start > end)
    end = end.addDays(1);
  for (let date = start; date < end; date = addMinutes(date,15)) {
    times.push(date);
  }
  return times;
}
function getXYforTimes(times, positionFunction, lonlat, offset) {
  const xy = [];
  for (let i = 0; i < times.length; i++) {
    xy.push(getXY(positionFunction(times[i], lonlat[1], lonlat[0]), offset));
  }
  return xy;
}


const SunmoonCircleComponent = () => {
  const getMapContext = useService(MapContext);
  setCenter(toLonLat(window.View && window.View.center || Config.center));
  const lonlat = center();
  const currentTime = new Date();
  const sunTimes = SunCalc.getTimes(currentTime, lonlat[1], lonlat[0]);
  const moonTimes = SunCalc.getMoonTimes(currentTime, lonlat[1], lonlat[0]);
  const bounds = createElementBounds(document.querySelector(`#${getMapContext().map().get('target')}`));


  const timeOffetMinutes = calculateTimeOffset(currentTime, lonlat);

  const circleSize = Math.min(Math.min(bounds.width, bounds.height) - 80, 500);
  const controlMargin = 20;
  const fullControlSize = circleSize + controlMargin * 2;
  const halfSize = circleSize / 2;
  const moonRadius = 6;

  const dawn = sunTimes['dawn'];
  const sunrise = sunTimes['sunrise'];
  const sunset = sunTimes['sunset'];
  const dusk = sunTimes['dusk'];
  const sunPosition = SunCalc.getPosition(currentTime, lonlat[1], lonlat[0]);
  const sunVisible = (currentTime >= dawn && currentTime <= dusk) || sunPosition.altitude > 0;

  const moonPosition = SunCalc.getMoonPosition(currentTime, lonlat[1], lonlat[0]);
  
  const moonX = halfSize + (halfSize - (halfSize / 2 + moonRadius) * moonPosition.altitude) * Math.cos(moonPosition.azimuth + Math.PI / 2);
  const moonY = halfSize + (halfSize - (halfSize / 2 + moonRadius) * moonPosition.altitude) * Math.sin(moonPosition.azimuth + Math.PI / 2);
  const moonIllumination = SunCalc.getMoonIllumination(currentTime).fraction.toFixed(2);
  const moonVisible = moonPosition.altitude > -0.1;
  

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

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  Date.prototype.addDays = function (days) {
    return new Date(this.getTime() + (days * 24 * 60 * 60 * 1000));
  };
  Date.prototype.addHours = function (hours) {
    return new Date(this.getTime() + (hours * 60 * 60 * 1000));
  };
  
  Date.prototype.addSeconds = function (seconds) {
    return new Date(this.getTime() + (seconds * 1000));
  };
  Date.prototype.isValid = function (d) {
    return isValidDate(d);
  };

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
    
      this.getSvgTextLabel(dusk, SunCalc.getPosition(dusk, latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded'),
        this.getSvgTextLabel(dawn, SunCalc.getPosition(dawn, latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded'),
        this.getSvgTextLabel(this.getDateForHour(0), SunCalc.getPosition(this.getDateForHour(0), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(3), SunCalc.getPosition(this.getDateForHour(3), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(6), SunCalc.getPosition(this.getDateForHour(6), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(9), SunCalc.getPosition(this.getDateForHour(9), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(12), SunCalc.getPosition(this.getDateForHour(12), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(15), SunCalc.getPosition(this.getDateForHour(15), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(18), SunCalc.getPosition(this.getDateForHour(18), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(this.getDateForHour(21), SunCalc.getPosition(this.getDateForHour(21), latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded', sunrise, sunset),
        this.getSvgTextLabel(sunrise, SunCalc.getPosition(sunrise, latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded'),
        this.getSvgTextLabel(sunset, SunCalc.getPosition(sunset, latlng.lat, latlng.lng), `suncalc-sun-label ${theme}`, 'suncalc-shaded'),
          
        timeDifferenceLabel,
      
      
      </svg>
    </svg>
*/
  const viewBox = `0 0 ${fullControlSize} ${fullControlSize}`;
  return (
    <svg id={'suncalc-container'} width={fullControlSize} height={fullControlSize} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={viewBox}>
      <svg id={'suncalc-circle'} class="suncalc-circle" width={fullControlSize} height={fullControlSize} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={viewBox}>
        <TimeLabel date={sunrise} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel date={dawn} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel date={dusk} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel date={sunset} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={0} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={3} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={6} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={9} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={12} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={15} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={18} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
        <TimeLabel hour={21} positionFn={SunCalc.getPosition} lon={center()[0]} lat={center()[1]} cls={'suncalc-sun-label'} shadedCls={'suncalc-shaded'} startTime={sunrise} endTime={sunset} timeOffetMinutes={timeOffetMinutes} controlMargin={controlMargin} circleSize={circleSize}/>
      </svg>
      <svg id={'suncalc'} x={controlMargin} y={controlMargin} class="suncalc" width={fullControlSize} height={fullControlSize} xmlns="http://www.w3.org/2000/svg" overflow="visible" viewBox={viewBox}>
        <defs>
          <filter id="filter0_d" x="0" y="0" width={fullControlSize} height={fullControlSize} filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="10"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.72 0 0 0 0 0 0 0 0 1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
          <filter id="filter1_d" x="0" y="0" width={fullControlSize} height={fullControlSize} filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="5"/>
            <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
        </defs>
        <AzmimuthCircle halfSize={halfSize}/>
        <SunPathCircle halfSize={halfSize} sunrise={sunrise} sunset={sunset} lonlat={center}/>
        <Show when={moonVisible}>
          <MoonCircle x={moonX} y={moonY} radius={6} opacity={moonIllumination}/>
        </Show>
        <Show when={sunVisible}>
          <SunCircle halfSize={halfSize} radius={13} sunPosition={sunPosition}/>
        </Show>
      
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
  setMap(map){
    super.setMap(map);
    this._map = map;
    this._map.on('moveend', placeChanged);
  }
}