import Secrets from "./secrets";
import { fromLonLat } from "ol/proj";

if(!window.ENV)
{
    console.info("ENV variable should be defined in real application before this script")
    window.ENV = {

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
}

/**
 * @type {{
* images: string,
* }}
*/
const Frontend = {
    images: 'https://gis.extremum.org/images'
}

/**
 * @type {{
 * backend: Backend,
 * frontend: Frontend
 * center: import("ol/coordinate").Coordinate,
 * zoom: number
 * }}
 */
const Config = {
    backend: Backend,
    frontend: Frontend,
    center: fromLonLat([30, 60]),
    zoom: 11,
    ...ENV,
    ...Secrets
}
export default Config;