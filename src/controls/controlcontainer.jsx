import { onMount } from 'solid-js';

export const ControlContainer = props => {

  onMount(()=> {
    const self = document.getElementById(props.id);
    const parent = self.parentElement;
    parent.removeChild(self);
    if(!props.target)
      document.getElementsByClassName('ol-overlaycontainer-stopevent')[0].appendChild(self);
    else
      document.getElementById(props.target).appendChild(self);
  });
    
  return (<div id={props.id} class={props.classes}>
    {props.children}
  </div>);
};