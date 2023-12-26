import { onMount } from "solid-js";
import { useService } from "solid-services";
import { MapContext } from "../services/mapcontext";

export const Control = (props) => {
    const controlClass = props.klass;
    
    onMount(()=> {
        console.log('mounting control')
        const getMap = useService(MapContext);
        if(!controlClass) throw new Error('klass must contain class for Control instance')

        const options = props.options;
        const control = new controlClass(options);
        getMap().map().addControl(control);
    });    
    return null;
}