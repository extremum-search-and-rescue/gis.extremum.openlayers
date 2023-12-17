console.log("running app.js");

import { render } from 'solid-js/web';
import { FullScreenMapContainer } from './controls/mapcontainer'

render(() => <FullScreenMapContainer/>, document.body);

console.log("created map container")