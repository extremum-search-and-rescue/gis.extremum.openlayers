import {toLonLat} from 'ol/proj';
import {XYZ} from 'ol/source.js';
import SunCalc from 'suncalc';
import {WebGLTile} from 'ol/layer.js';

const data = {
  'sunEl': 0,
  'sunAz': 90,
  'vert': 4,
};

// The method used to extract elevations from the DEM.
// In this case the format used is Terrarium
// red * 256 + green + blue / 256 - 32768
//
// Other frequently used methods include the Mapbox format
// (red * 256 * 256 + green * 256 + blue) * 0.1 - 10000
//
function elevationFn(xOffset, yOffset) {
  const red = ['band', 1, xOffset, yOffset];
  const green = ['band', 2, xOffset, yOffset];
  const blue = ['band', 3, xOffset, yOffset];

  // band math operates on normalized values from 0-1
  // so we scale by 255
  return [
    '+',
    ['*', 255 * 256, red],
    ['*', 255, green],
    ['*', 255 / 256, blue],
    -32768,
  ];
}

// Generates a shaded relief image given elevation data.  Uses a 3x3
// neighborhood for determining slope and aspect.
const dp = ['*', 2, ['resolution']];
const z0x = ['*', ['var', 'vert'], elevationFn(-1, 0)];
const z1x = ['*', ['var', 'vert'], elevationFn(1, 0)];
const dzdx = ['/', ['-', z1x, z0x], dp];
const z0y = ['*', ['var', 'vert'], elevationFn(0, -1)];
const z1y = ['*', ['var', 'vert'], elevationFn(0, 1)];
const dzdy = ['/', ['-', z1y, z0y], dp];
const slope = ['atan', ['sqrt', ['+', ['^', dzdx, 2], ['^', dzdy, 2]]]];
const aspect = ['clamp', ['atan', ['-', 0, dzdx], dzdy], -Math.PI, Math.PI];
const sunEl = ['*', Math.PI / 180, ['var', 'sunEl']];
const sunAz = ['*', Math.PI / 180, ['var', 'sunAz']];

const cosIncidence = [
  '+',
  ['*', ['sin', sunEl], ['cos', slope]],
  ['*', ['cos', sunEl], ['sin', slope], ['cos', ['-', sunAz, aspect]]],
];
const scaled = ['*', 255, cosIncidence];

const webGlTile = new WebGLTile({
  opacity: 0.2,
  preload: Infinity,
  source: new XYZ({
    url: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    maxZoom: 15,
    attributions:
        '<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md" target="_blank">Data sources and attribution</a>',
  }),
  style: {
    variables: data,
    color: ['color', scaled, scaled, scaled],
  },
});

webGlTile.on('precompose', function (event) {
  const viewState = event.frameState.viewState;
  const center = toLonLat(viewState.center);
  const sunPositon = SunCalc.getPosition(new Date(), center[1],center[0]);
  const moonPosition =  SunCalc.getMoonPosition(new Date(), center[1], center[0]);
  let elevation = sunPositon.altitude;
  let azimuth = sunPositon.azimuth;
  if(elevation<0) 
  {
    elevation = moonPosition.altitude;
    azimuth = moonPosition.azimuth;
  }
  if(Number.isNaN(elevation) || elevation < 0)
  {
    elevation = 1;
    azimuth = 0;
  }
  data['sunEl'] = elevation / Math.PI * 180;
  data['vert'] = 4;
  data['sunAz'] = 180 + azimuth / Math.PI * 180;
  data['resolution'] = viewState.resolution;
  webGlTile.updateStyleVariables(data);
});

export const HillshadingGPU = {
  id: 'HSg',
  title: 'Hillshading GPU',
  visible: false,
  layers: [
    webGlTile
  ]
};