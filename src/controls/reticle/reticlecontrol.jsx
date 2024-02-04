import Control from 'ol/control/Control';
import { getDistance } from 'ol/sphere.js';
import { createComponent, createEffect, createSignal, on, Show } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';
import { useService } from 'solid-services';
import { MapContext } from '../../services/mapcontext';
import { toLonLat } from 'ol/proj';

const _HALF = 1 / 2;
const _QUARTER = 1 / 4;
const _THREE_QUARTERS = 3 / 4;
const [center, setCenter] = createSignal();
const [rotationRad, setRotationRad] = createSignal(0);
const [show, setShow] = createSignal(false);

const Line = props => {
  return (
    <>
      <rect class={props.classes} x={props.x} y={props.y} width={props.width} height={props.height} style={props.style}/>
      {props.children}
    </>
  );
};

const Label = props => {
  return (
    <text class={props.classes} x={props.x} y={props.y} style={props.style}>{props.text()}</text>
  );
};

const ReticleComponent = () => {
  const [halfSize, setHalfSize] = createSignal(256);
  const [verticalLineHight, setVerticalLineHeight] = createSignal(0);
  const [horizontalLineWidth, setHorizontalLineWidth] = createSignal(0);  
  const [widthText, setWidthText] = createSignal('');
  const [heightText, setHeightText] =  createSignal('');

  const getMapContext = useService(MapContext);
  const map = getMapContext().map();
  
  let bounds = createElementBounds(document.querySelector(`#${map.get('target')}`), { 
    trackMutation: false, 
    trackScroll: false, 
    trackResize: true
  });

  function onRotationChange(){
    onPlaceChange(center());
  }

  function onPlaceChange(centerCoord){
    centerCoord ??= center();
    setHalfSize(Math.round(Math.min(bounds.width, bounds.height)/2) - 56);

    function _getScaleRatioLabel(maxDist) {
      let roundDist, unitStr;
      if (maxDist > 1000) {
        maxDist = maxDist / 1000;
        roundDist = _getRoundNum(maxDist);
        unitStr = 'км';
      }
      else {
        roundDist = _getRoundNum(maxDist);
        unitStr = 'м';
      }
      return [roundDist / maxDist, `${roundDist} ${unitStr}`];
    }
  
    function _getRoundNum(num) {
      let pow10 = Math.pow(10, `${Math.floor(num)}`.length - 1);
      let d = num / pow10;
      d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : 1;
      return pow10 * d;
    }
    const maxReticleWidth = () => Math.min(288, halfSize() - 20);
    const maxReticleHeight = () => Math.min(320, halfSize() - 20);
    
    function _calculateMaxDistance(x, y) {
      if(centerCoord == null || x == null || y == null) return 0;
      const from = toLonLat(centerCoord);
      const pixel = [x, y];
      const toRaw = map.getCoordinateFromPixel(pixel);
      if(toRaw == null) return 0;
      const to = toLonLat(toRaw);

      return getDistance(from, to);
    }
    const widthDist = () => _calculateMaxDistance(bounds.width / 2 + maxReticleWidth(), bounds.width / 2);
    const heightDist = () => _calculateMaxDistance(bounds.height / 2, bounds.height / 2 + maxReticleHeight());

    const [widthRatio, wText] = _getScaleRatioLabel(widthDist());
    const [heightRatio, hText] = _getScaleRatioLabel(heightDist());
    setWidthText(wText);
    setHeightText(hText);
    setHorizontalLineWidth(Math.round(widthRatio * maxReticleWidth() - 8));
    setVerticalLineHeight(Math.round(heightRatio * maxReticleHeight() - 8));
  }
  createEffect(on(center, onPlaceChange, {defer: true}));
  createEffect(on(rotationRad, onRotationChange, {defer: true}));
  setCenter(map.getView().getCenter());

  return (
    <svg xmlns="http://www.w3.org/2000/svg" class='reticle-container' width={halfSize()*2} height={halfSize()*2}>
      <Show when={show()}>
        <Line classes='reticle-line x' x={halfSize()+8} y={halfSize()} style={{width: horizontalLineWidth()-8}} height={2}>
          <rect class={'reticle-tick x'} x={_QUARTER*horizontalLineWidth()+halfSize()} width={2} y={halfSize()+2} height={4}/>
          <rect class={'reticle-tick x'} x={_HALF*horizontalLineWidth()+halfSize()} width={2} y={halfSize()+2} height={8}/>
          <rect class={'reticle-tick x'} x={_THREE_QUARTERS*horizontalLineWidth()+halfSize()} y={halfSize()+2} width={2} height={4}/>
          <rect class={'reticle-tick x'} x={horizontalLineWidth()+halfSize()} y={halfSize()} width={2} height={10}/>
        </Line>
        <Label classes='reticle-text x' text={widthText} x={halfSize()+horizontalLineWidth()-20} y={halfSize()-4}/>
        <Line classes='reticle-line y' x={halfSize()} y={halfSize()+8} width={2} style={{height: verticalLineHight()-8}}>
          <rect class={'reticle-tick y'} y={_QUARTER*verticalLineHight()+halfSize()} x={halfSize()+2} width={4} height={2}/>
          <rect class={'reticle-tick y'} y={_HALF*verticalLineHight()+halfSize()} x={halfSize()+2} width={8} height={2}/>
          <rect class={'reticle-tick y'} y={_THREE_QUARTERS*verticalLineHight()+halfSize()} x={halfSize()+2} width={4} height={2}/>
          <rect class={'reticle-tick y'} y={verticalLineHight()+halfSize()} x={halfSize()} width={10} height={2}/>
        </Line>
        <Label classes='reticle-text y' text={heightText} x={halfSize()} y={halfSize()+verticalLineHight()+16}/>
      </Show>
    </svg>
  );
};

export class Reticle extends Control {
  asLayerId = 'SC';
  constructor(options) {
    options = options || {};
    const element = createComponent(ReticleComponent);
    
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
  setVisible(state) {
    setShow(state);
  }
  // eslint-disable-next-line solid/reactivity
  getVisible(){
    return show();
  }
  setMap(map){
    super.setMap(map);
    this._map = map;
    this._map.on('moveend', (event) => show() && setCenter(event.map.getView().getCenter()));
  }
}