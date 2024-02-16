import { Icon, Style } from 'ol/style.js';
import { customGetNextColorPair } from '../utils/colors';

export const createMarkerStyle = function(feature, resolution){
  let colorPair = [feature.get('color'), feature.get('outline') || 'fff'];
  if(!colorPair[0]){
    colorPair = customGetNextColorPair();
    feature.set('color', colorPair[0]);
    feature.set('outline', colorPair[1]);
  }
  feature.set('icon', 'marker');
  const iconTemplate = `data:image/svg+xml,%3Csvg width='37' height='42' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d)'%3E%3Cpath d='M17.3 38c5.9-.76 22.1-12.37 12.97-12.98-9.11-.6-14.67 11.7-12.96 12.98z' fill='%23000' fill-opacity='.05'/%3E%3C/g%3E%3Cg filter='url(%23filter1_d)'%3E%3Cpath d='M28 13.37c0 6.28-9.17 22.26-11 24.63-1.83-2.37-11-18.35-11-24.63C6 7.09 10.92 2 17 2s11 5.09 11 11.37z' fill='%23${colorPair[1]}'/%3E%3C/g%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M26.47 19.15C27.43 16.61 28 14.46 28 13a11 11 0 00-22 0c0 1.46.57 3.61 1.53 6.15.95 2.5 2.24 5.28 3.61 7.94 2.2 4.29 4.54 8.2 5.86 10.18 1.32-1.98 3.66-5.9 5.86-10.18a80.95 80.95 0 003.61-7.94zm-8.86 19C20.51 33.91 29 19.11 29 13a12 12 0 00-24 0c0 6.1 8.49 20.9 11.39 25.15.25.37.45.65.61.85.16-.2.36-.48.61-.85z' fill='url(%23paint0_linear)'/%3E%3Cpath d='M28 13.12c0 6.13-9.17 21.76-11 24.08-1.83-2.32-11-17.95-11-24.08C6 6.98 10.92 2 17 2s11 4.98 11 11.12z' fill='url(%23paint1_linear)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M25.6 18.8c.89-2.36 1.4-4.34 1.4-5.68C27 7.52 22.51 3 17 3S7 7.52 7 13.12c0 1.34.51 3.32 1.4 5.67a75.34 75.34 0 003.3 7.35c1.98 3.9 4.08 7.45 5.3 9.32 1.22-1.87 3.32-5.43 5.3-9.32a75.34 75.34 0 003.3-7.35zm-8 17.55C20.32 32.32 28 18.74 28 13.12 28 6.98 23.08 2 17 2S6 6.98 6 13.12c0 5.62 7.69 19.2 10.4 23.23.24.37.45.66.6.85.15-.2.36-.48.6-.85z' fill='url(%23paint2_linear)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M23 13a6 6 0 11-12 0 6 6 0 0112 0zm-6 4.8a4.8 4.8 0 100-9.6 4.8 4.8 0 000 9.6z' fill='url(%23paint3_linear)'/%3E%3Cpath d='M21.5 13a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z' fill='%23fff' stroke='%23${colorPair[0]}'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='17' y1='1' x2='17' y2='39' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23${colorPair[0]}' stop-opacity='.85'/%3E%3Cstop offset='1' stop-color='%23${colorPair[0]}'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear' x1='17' y1='2' x2='17' y2='37.2' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='.23' stop-color='%23${colorPair[0]}' stop-opacity='.85'/%3E%3Cstop offset='.39' stop-color='%23${colorPair[0]}' stop-opacity='.9'/%3E%3Cstop offset='1' stop-color='%23${colorPair[0]}'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear' x1='17' y1='2' x2='17' y2='37.2' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23FFF' stop-opacity='.6'/%3E%3Cstop offset='1' stop-color='%23FFF' stop-opacity='.4'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint3_linear' x1='17' y1='7' x2='17' y2='19' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23${colorPair[1]}' stop-opacity='.3'/%3E%3Cstop offset='1' stop-color='%23${colorPair[1]}' stop-opacity='.15'/%3E%3C/linearGradient%3E%3Cfilter id='filter0_d' x='13' y='21' width='24' height='21' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3Cfilter id='filter1_d' x='4' y='0' width='26' height='40' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E`;
  return new Style({
    image: new Icon({
      src: iconTemplate,
      anchor: [17,1],
      scale: resolution 
        ? resolution < 15 ? 1 : 0.5 
        : 1,
      anchorYUnits: 'fraction',
      anchorXUnits: 'pixels'
    })
  });
};