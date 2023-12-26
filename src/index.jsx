import './index.css';
import './../node_modules/ol/ol.css';
console.log('running index.js');

import { render } from 'solid-js/web';
import { FullScreenMapContainer } from './controls/mapcontainer'


render(() => <FullScreenMapContainer id={"indexMap"}/>, document.body);



console.log('created map');
