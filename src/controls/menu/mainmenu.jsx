import { Menu, MenuSeparator } from '@ark-ui/solid';
import Control from 'ol/control/Control';
import { createComponent, createSignal } from 'solid-js';
import { createFileUploader } from '@solid-primitives/upload';
import { useService } from 'solid-services';
import { LayerService} from '../../services/layerservice.js';
import GPX from 'ol/format/GPX';
import { PLT } from '../../format/PLT.js';
import { MapContext } from '../../services/mapcontext.js';
import { get as getProjection} from 'ol/proj.js';
import { About } from '../../components/about.jsx';
import { ManageObjects } from '../../components/manageobjects.jsx';

const MenuComponent = () => {
  // eslint-disable-next-line no-unused-vars
  const { files, selectFiles } = createFileUploader({ multiple: true, accept: '*' });
  const [isAboutOpen, setAboutOpen ] = createSignal(false);
  const [isManageOpen, setManageOpen ] = createSignal(false);
  const getLayerService = useService(LayerService);
  const getMapContext = useService(MapContext);

  async function read(inputFile){
    try {
      const layerService = getLayerService();
      const map = getMapContext().map();
      let features;
      const fileNameInLowerCase = inputFile.name.toLowerCase();
      if(fileNameInLowerCase.endsWith('.gpx')) {
        features = new GPX().readFeatures(await inputFile.file.text(), { featureProjection: getProjection('EPSG:3857') });
      }
      else if(fileNameInLowerCase.endsWith('.plt')){
        features = new PLT().readFeatures(await inputFile.file.text());
      }
      else{
        const text = 'Unknown file type';
        map.dispatchEvent({type: 'toast', message: `${text}: ${inputFile.name}`});
      }
      if(features != null) 
      {
        layerService.addFeatures(features, map);
      }
    } catch (error) {
      getMapContext().map().dispatchEvent({type: 'toast', message: error.toString()});
    }
  }
        
  function onFileImport(){
    selectFiles(filesFromDialog => filesFromDialog.forEach(async inputFile => await read(inputFile)));
  }
  function onAbout() {
    setAboutOpen(true);
  }
  function onManage() {
    setManageOpen(true);
  }
  return (
    <div class="gis-control-toolbar gis-mainmenu">
      <Menu.Root>
        <Menu.Trigger class={'gis-toolbar-button'}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="12" height="2" fill="currentColor"/>
            <rect x="2" y="7" width="12" height="2" fill="currentColor"/>
            <rect x="2" y="11" width="12" height="2" fill="currentColor"/>
          </svg>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item id='import-tracks' onpointerup={onFileImport}>
                        Import tracks
            </Menu.Item>
            <Menu.Item id='import-grids' disabled>
                        Import Grid
            </Menu.Item>
            <MenuSeparator/>
            <Menu.Item id='manage' onpointerup={onManage}>
              <ManageObjects isOpen={isManageOpen} setOpen={setManageOpen}/>Manage Objects
            </Menu.Item>
            <MenuSeparator/>
            <Menu.Item id='print' onpointerup={()=> window.print()}>
                        Print
            </Menu.Item>
            <MenuSeparator/>
            <Menu.Item id='about' onpointerup={onAbout}>
              <About isOpen={isAboutOpen} setOpen={setAboutOpen}/>About
            </Menu.Item>
            <MenuSeparator/>
            <Menu.Item id='exit' disabled>
                        Log in
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>
  );
};

export class MainMenu extends Control {
  constructor(options) {
    options = options || {};
    const element = createComponent(MenuComponent);

    super({
      element: element(),
      target: options.target || undefined,
    });
  }
  setMap(map){
    super.setMap(map);
    this._map = map;
  }
}