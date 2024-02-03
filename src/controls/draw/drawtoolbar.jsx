import { Switch, createComponent, createEffect, createSignal, For, Match } from 'solid-js';
import Control from 'ol/control/Control';
import { createStore } from 'solid-js/store';
import './drawtoolbar.css';
import { useService } from 'solid-services';
import { LayerService } from '../../services/layerservice';
import { Draw, Modify } from 'ol/interaction';
import { Fill, Stroke, Style, Text, Circle as CircleStyle, RegularShape} from 'ol/style.js';
import { LineString, Point} from 'ol/geom.js';
import { useCurrentlyHeldKey } from '@solid-primitives/keyboard';
import { Transition } from 'solid-transition-group';
import { getArea, getLength } from 'ol/sphere.js'


const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.2)',
  }),
  stroke: new Stroke({
    color: 'rgba(0, 0, 0, 0.5)',
    lineDash: [10, 10],
    width: 2,
  }),
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
  }),
});

const labelStyle = new Style({
  text: new Text({
    font: '14px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [3, 3, 3, 3],
    textBaseline: 'bottom',
    offsetY: -15,
  }),
  image: new RegularShape({
    radius: 8,
    points: 3,
    angle: Math.PI,
    displacement: [0, 10],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
  }),
});

const tipStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const modifyStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
  text: new Text({
    text: 'Drag to modify',
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.7)',
    }),
    padding: [2, 2, 2, 2],
    textAlign: 'left',
    offsetX: 15,
  }),
});

const segmentStyle = new Style({
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: 'rgba(255, 255, 255, 1)',
    }),
    backgroundFill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
    padding: [2, 2, 2, 2],
    textBaseline: 'bottom',
    offsetY: -12,
  }),
  image: new RegularShape({
    radius: 6,
    points: 3,
    angle: Math.PI,
    displacement: [0, 8],
    fill: new Fill({
      color: 'rgba(0, 0, 0, 0.4)',
    }),
  }),
});

const segmentStyles = [segmentStyle];

const formatLength = function (line) {
  const length = getLength(line);
  let output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + ' km';
  } else {
    output = Math.round(length * 100) / 100 + ' m';
  }
  return output;
};

const formatArea = function (polygon) {
  const area = getArea(polygon);
  let output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
  } else {
    output = Math.round(area * 100) / 100 + ' m\xB2';
  }
  return output;
};

function styleFunction(feature, segments, drawType, tip) {
  const styles = [];
  const geometry = feature.getGeometry();
  const type = geometry.getType();
  let point, label, line;
  if (!drawType || drawType === type || type === 'Point') {
    styles.push(style);
    if (type === 'Polygon') {
      point = geometry.getInteriorPoint();
      label = formatArea(geometry);
      line = new LineString(geometry.getCoordinates()[0]);
    } else if (type === 'LineString') {
      point = new Point(geometry.getLastCoordinate());
      label = formatLength(geometry);
      line = geometry;
    }
  }
  if (segments && line) {
    let count = 0;
    line.forEachSegment(function (a, b) {
      const segment = new LineString([a, b]);
      const label = formatLength(segment);
      if (segmentStyles.length - 1 < count) {
        segmentStyles.push(segmentStyle.clone());
      }
      const segmentPoint = new Point(segment.getCoordinateAt(0.5));
      segmentStyles[count].setGeometry(segmentPoint);
      segmentStyles[count].getText().setText(label);
      styles.push(segmentStyles[count]);
      count++;
    });
  }
  if (label) {
    labelStyle.setGeometry(point);
    labelStyle.getText().setText(label);
    styles.push(labelStyle);
  }
  if (
    tip &&
    type === 'Point' &&
    !DrawToolbar.modify.getOverlay().getSource().getFeatures().length
  ) {
    DrawToolbar.tipPoint = geometry;
    tipStyle.getText().setText(tip);
    styles.push(tipStyle);
  }
  return styles;
}

const DrawToolbarComponent = props => {    
  return (
    <div class={props.classes}>
      <For each={props.buttons}>
        {(item) => 
          <button class={props.buttonClasses} aria-pressed={item.toggled} onClick={() => props.interaction(item.type)}>{item.content}</button>
        }
      </For>
    </div>
  );
};

export class DrawToolbar extends Control {

  
  static modify;

  static tipPoint;



  constructor(options, children) {  
    const getLayers = useService(LayerService);        
    let activeDraw;
    
    const key = useCurrentlyHeldKey();
    const [isFreehand, setFreehand] = createSignal(false);
    createEffect(()=> setFreehand( key() == 'SHIFT') );
    DrawToolbar.modify = new Modify({
      source: getLayers().userDrawingLayer, 
      style: DrawToolbar.modifyStyle
    });

    const [buttons, setButtons] = createStore([
      {
        type: 'Point',
        toggled: false,
        content: () => (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 5.82143C12.5 6.3908 12.2858 7.22122 11.9082 8.2054C11.536 9.17532 11.0251 10.2443 10.4757 11.2717C9.92688 12.2981 9.34406 13.2747 8.83154 14.0584C8.5099 14.5502 8.22539 14.9514 8 15.2393C7.77461 14.9514 7.4901 14.5502 7.16846 14.0584C6.65594 13.2747 6.07312 12.2981 5.52425 11.2717C4.97488 10.2443 4.46399 9.17532 4.09181 8.2054C3.71415 7.22122 3.5 6.3908 3.5 5.82143C3.5 3.45175 5.49742 1.5 8 1.5C10.5026 1.5 12.5 3.45175 12.5 5.82143Z" stroke="currentColor"/>
            <circle cx="8" cy="6" r="1.5" stroke="currentColor"/>
          </svg>
        )
      },
      {
        type: 'LineString',
        toggled: false,
        content: () => (
          <Transition name={'highlight'} appear={true}>
            <Switch >
              <Match when={!isFreehand()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.5 11.5H2.5V13.5H0.5V11.5Z" stroke="currentColor"/>
                  <path d="M12.5 4.5H14.5V6.5H12.5V4.5Z" stroke="currentColor"/>
                  <path d="M12.5 6L2.50001 12.5" stroke="currentColor"/>
                </svg>
              </Match>
              <Match when={isFreehand()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 5C13 5 10 15.5 4.99993 7.99996C3.88479 6.32726 2 14 2 14" stroke="currentColor"/>
                </svg>
              </Match>
            </Switch>
          </Transition>  
        )
      },
      {
        type: 'Polygon',
        toggled: false,
        content: () => (
          <Transition name={'highlight'} appear={true}>
            <Switch>
              <Match when={!isFreehand()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10.5" y="1.5" width="2" height="2" stroke="currentColor"/>
                  <rect x="11.5" y="11.5" width="2" height="2" stroke="currentColor"/>
                  <path d="M1.5 5.5H3.5V7.5H1.5V5.5Z" stroke="currentColor"/>
                  <path d="M3.5 7.5L11.265 12.576" stroke="currentColor"/>
                  <path d="M3.49999 6L10.803 2.54043" stroke="currentColor"/>
                  <path d="M11.5 3.50002L12.5 11.5" stroke="currentColor"/>
                </svg>
              </Match>
              <Match when={isFreehand()}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 13.5C7 13 7.5 8.50001 1.5 6.5C5 1.50001 8.5 4 11 2.5C14 4.5 12.5 8.49999 14.5 13.5Z" stroke="currentColor"/>
                </svg>
              </Match>
            </Switch>       
          </Transition>       
        )
      },
      {
        type: 'Circle',
        toggled: false,
        content: () => (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="5" stroke="currentColor"/>
          </svg>
        )
      },
    ]);
    
    const params = {
      classes: 'gis-control-toolbar gis-toolbar ol-unselectable',
      buttons: buttons,
      buttonClasses: 'gis-toolbar-button',
      interaction: (type) => {
        const activeTip =
        'Click to continue drawing the ' +
        (type === 'Polygon' ? 'polygon' : 'line');
        const idleTip = 'Click to start measuring';
        let tip = idleTip;
        const drawLayer = getLayers().userDrawingLayer;
        if(activeDraw) {
          this.map_.removeInteraction(activeDraw);
          setButtons((b) => b.type == activeDraw.mode_,'toggled',false);
        }
        if(!activeDraw || type != activeDraw.mode_)
        {
          activeDraw = new Draw({
            source: drawLayer,
            type: type,
            style: function (feature) {
              return styleFunction(feature, type == 'LineString', type, tip);
            },
          });
          setButtons((b) => b.type == type, 'toggled', true );
          activeDraw.on('drawstart', function () {
            
            DrawToolbar.modify.setActive(false);
            tip = activeTip;
          });
          activeDraw.on('drawend', function () {
            modifyStyle.setGeometry(DrawToolbar.tipPoint);
            DrawToolbar.modify.setActive(true);
            this.map_.once('pointermove', function () {
              modifyStyle.setGeometry();
            });
            tip = idleTip;
          });
          DrawToolbar.modify.setActive(true);
          this.map_.addInteraction(activeDraw);
        }
      },
      children: children
    };
    const element = createComponent(DrawToolbarComponent, params);

    super({
      element: element(),
      target: options.target || undefined,
    });
  }
  setMap(map){
    super.setMap(map);
    this.map_ = map;
    map.addInteraction(DrawToolbar.modify);
  }
}