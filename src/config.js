import {Secrets } from './secrets';
import { fromLonLat } from 'ol/proj';

if(!window.ENV)
{
  // eslint-disable-next-line no-console
  console.warn('ENV variable should be defined in real application before this script');
  var ENV = window.ENV = {
    VERSION_DATE: new Date().toLocaleString(),
    INIT_DATE: new Date().toLocaleString(),
    INIT_DATE_FORMATTED: new Date().toUTCString(),
    IS_DEVELOPMENT: true
  };
}

/**
 * @type {{
* scheme: string,
* host: string,
* }}
*/
const Backend = {
  scheme: 'https',
  host: 'layers.extremum.org'
};

/**
 * @type {{
* images: string,
* }}
*/
const Frontend = {
  images: 'https://gis.extremum.org/images'
};

/**
 * @mixes import('./secrets').Secrets
 * @mixes ENV
 * @type {{
 * backend: Backend,
 * frontend: Frontend
 * center: import('ol/coordinate').Coordinate,
 * zoom: number
 * }}
 */
export const Config = {
  backend: Backend,
  frontend: Frontend,
  center: fromLonLat([30, 60]),
  zoom: 11,
  ...ENV,
  ...Secrets
};