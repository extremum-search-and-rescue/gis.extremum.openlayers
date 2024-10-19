import './index.css';
import { GoogleSatellite, GeolocationPublic } from './layers/index';
import View from 'ol/View.js';
import { Config } from './config';
import { ServiceRegistry } from 'solid-services';
import { MapContainer } from './components/mapcontainer';

export const GeoCase = () => {
  const view = window.View = new View({
    center: Config.center,
    zoom: Config.zoom,
  });
  return (
    <ServiceRegistry>
      <MapContainer 
        id={'indexMap'} 
        basemaps={[
          GoogleSatellite
        ]} 
        overlays={[
          GeolocationPublic
        ]}
        config={Config}
        view={view}>
      </MapContainer>
    </ServiceRegistry>
  );
};