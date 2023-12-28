import { createComponent, onMount } from "solid-js"

export const ControlContainer = props => {

    onMount(()=> {
        const self = document.getElementById(props.id);
        const parent = self.parentElement;
        parent.removeChild(self);
        document.getElementsByClassName('ol-overlaycontainer-stopevent')[0].appendChild(self);
    })
    
    return (<div id={props.id} class={props.classes}>
        {props.children}
    </div>);
}