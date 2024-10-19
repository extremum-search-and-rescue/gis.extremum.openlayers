import { onMount, For, createSignal} from 'solid-js';

export const ControlContainer = props => {
  let [containerDiv, setContainerDiv] = createSignal(null);

  onMount(()=> {
    const self = document.getElementById(props.id);
    const parent = self.parentElement;
    parent.removeChild(self);
    if(!props.target)
      document.getElementsByClassName('ol-overlaycontainer-stopevent')[0].appendChild(self);
    else
      document.getElementById(props.target).appendChild(self);
  });
    
  return (<div id={props.id} class={props.classes} ref={(el) => setContainerDiv(el)}>
    <For each={props.children}>
      {
        (item) => {
          return item({parent: containerDiv});
        }
      }
    </For>
  </div>);
};