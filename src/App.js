console.log("running app.js");

import { render } from 'solid-js/web';
import { MapContainer} from './controls/mapcontainer'

render(() => <MapContainer/>, document.body);

console.log("created map container")