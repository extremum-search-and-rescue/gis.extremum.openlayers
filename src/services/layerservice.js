import { createStore } from "solid-js/store";
import { useService } from "solid-services";
import { MapContext } from "./mapcontext";

export function LayerService() {
    const [bm, setBm] = createStore([]);
    const [om, setOm] = createStore([]);
    const getMapcontext = useService(MapContext);

    return {
        get basemaps() {
            return bm;
        },
        /**
         * set basemaps: Array
         */
        set basemaps(basemaps){
            setBm(basemaps);
            console.info('basemaps set')
        },
        get overlays() {
           return om; 
        },
        set overlays(overlays) {
            setOm(overlays);
            console.info('overlays set')
        },
        toggleOverlay(id, checked) {
            setOm(l => l.id === id , 'visible', checked )
            getMapcontext()
                .map()
                .getAllLayers()
                .filter(l =>l.id === id)
                .forEach(l => l.setVisible(checked))
        },
        changeBasemap(id){
            setBm({}, 'visible', false) //sets all basemaps as hidden
            setBm(l => l.id === id, 'visible', true);
            getMapcontext()
                .map()
                .getAllLayers()
                .filter(l => l.type == 'base')
                .forEach(l =>l.setVisible(l.id === id));
            
        },
        get currentBasemap(){
            return bm.filter(b => b.visible)[0];
        },
        get currentBasemapId(){
            const cb = bm.filter(b => b.visible)[0]
            return cb && cb.id;
        },
        get flat(){
            const layersToAdd = bm
                .flatMap((b) => b.layers.map((l) => Object.assign(l, {id: b.id, type: 'base', visible: b.visible || false})))
                .concat(om.flatMap((o) => o.layers.map((l) => Object.assign(l, {id: o.id, visible: o.visible || false}))));

            layersToAdd.forEach((l) => l.setVisible(l.visible));
            return layersToAdd;
        }
    }
}