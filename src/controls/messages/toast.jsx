import Control from 'ol/control/Control';
import { createComponent, createSignal} from 'solid-js';

const [message, setMessage] = createSignal('Test');
const [show, setShow] = createSignal(false);

let toastTimeoutId;

const ToastComponent = props =>{
  return (
    <div class={`${props.classes} container`} style={{
      visibility: show() ? 'visible': 'hidden', 
      opacity: show() ? 1 : 0
    }}>
      <div class={`${props.classes} background`}>
        <div class={`${props.classes} content`} style={{
          visibility: show() ? 'visible': 'hidden', 
          opacity: show() ? 1 : 0
        }}>{
            message()
          }</div>
      </div>
    </div>
  );
};

export class Toast extends Control {
  constructor(options) {
    options = options || {};
    const element = createComponent(ToastComponent, {
      classes: options.className
    });
      
    super({
      element: element(),
      target: options.target || undefined,
    });
  }

  setMap(map){
    function onToast(event){
      setMessage(event.message);
      setShow(true);
      if(toastTimeoutId) clearTimeout(toastTimeoutId);
      
      toastTimeoutId = setTimeout(()=> {
        setShow(false);
      }, event.timeout ?? 5000);
    }
    super.setMap(map);
    this.map_ = map;
    
    this.map_.on('toast', onToast);
  }
}