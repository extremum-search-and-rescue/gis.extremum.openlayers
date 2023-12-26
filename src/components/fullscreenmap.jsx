import Div100vh from "solidjs-div-100vh";
import { MapContainer } from "./mapcontainer";

export const FullScreenMapContainer = props => {
    return <Div100vh>
      <MapContainer
          id={props.id}
          basemaps={props.basemaps} 
          overlays={props.overlays}
          view={props.view}>
        {props.children}
          </MapContainer>
    </Div100vh>;
}