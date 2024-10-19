import {  For, createEffect, createSignal} from 'solid-js';
import { Dynamic } from 'solid-js/web';

export const ControlContainer = props => {
  let [containerDiv, setContainerDiv] = createSignal(null);

  createEffect(() => {
    const self = containerDiv();
    const parent = self.parentElement;
    parent?.removeChild(self);
    if(!props.target)
      document.getElementsByClassName('ol-overlaycontainer-stopevent')[0].appendChild(self);
    else
      document.getElementById(props.target).appendChild(self);
  });
    
  return (<div id={props.id} class={props.classes} ref={(el) => setContainerDiv(el)}>
    <For each={props.children}>
      {
        (item) => {
          return <Dynamic parent={containerDiv()} component={item} />;
        }
      }
    </For>
  </div>);
};