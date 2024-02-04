import { onMount } from 'solid-js';
import { useService } from 'solid-services';
import { MapContext } from '../services/mapcontext';
import { LayerService } from '../services/layerservice';

export const Control = (props) => {
  // eslint-disable-next-line solid/reactivity
  const controlKlass = props.klass;
  if(!controlKlass) throw new Error('props.klass must contain class for Control instance');
  onMount(()=> {
    function toggleStateOfExternallyControlledVisibility(control){
      /** @type {import('solid-services').ServiceGetter<LayerService>} */
      const layerService = useService(LayerService);
      const controlState = layerService().controlStates.find(c => c.asLayerId === control.asLayerId);
      if(controlState){
        control.setVisible(controlState.visible);
      }
    }
    const getMap = useService(MapContext);
    let options = props.options || {};
    if(props.classes){
      options.className = props.classes;
    }
    if(props.target) {
      options.target = props.target;
    }
    const control = new controlKlass(options, props.children);
    if(control.asLayerId){
      toggleStateOfExternallyControlledVisibility(control);
    }
    getMap().map().addControl(control);
  });    
  return null;
};