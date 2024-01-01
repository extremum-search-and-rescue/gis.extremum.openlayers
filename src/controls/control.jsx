import { onMount } from 'solid-js';
import { useService } from 'solid-services';
import { MapContext } from '../services/mapcontext';

export const Control = (props) => {
  // eslint-disable-next-line solid/reactivity
  const controlKlass = props.klass;
  if(!controlKlass) throw new Error('props.klass must contain class for Control instance');
    
  onMount(()=> {
    const getMap = useService(MapContext);
    let options = props.options || {};
    if(props.classes){
      options.className = props.classes;
    }
    if(props.target) {
      options.target = props.target;
    }
    const control = new controlKlass(options, props.children);
    getMap().map().addControl(control);
  });    
  return null;
};