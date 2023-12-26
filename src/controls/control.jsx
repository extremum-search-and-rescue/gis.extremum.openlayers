import { onMount } from "solid-js";
import { useService } from "solid-services";
import { MapContext } from "../services/mapcontext";

export const Control = (props) => {
    const controlKlass = props.klass;
    if(!controlKlass) throw new Error('klass must contain class for Control instance')
    
    onMount(()=> {
        console.log('mounting control')
        const getMap = useService(MapContext);

        const options = props.options;
        const control = new controlKlass(options, props.children);
        getMap().map().addControl(control);
    });    
    return null;
}