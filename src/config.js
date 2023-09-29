import secrets from "./secrets";
import { fromLonLat } from "ol/proj";

if(!window.ENV)
{
    console.info("ENV variable should be defined in real application before this script")
    window.ENV = {

    };
}
/**
 * @type {{
 * center: import("ol/coordinate").Coordinate,
 * zoom: number
 * }}
 */
const config = {
    center: fromLonLat([30, 60]),//[-6655.5402445057125, 6709968.258934638],
    zoom: 11,
    ...ENV,
    ...secrets
}
export default config;