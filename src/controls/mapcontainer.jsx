import Div100vh from "solidjs-div-100vh";

export const FullScreenMapContainer = props => {
  return <Div100vh>
    <MapContainer id={props.id}></MapContainer>
  </Div100vh>;
}
export const MapContainer = props => {
  return (<div id={props.id}></div>)
}