import { Menu, MenuSeparator } from '@ark-ui/solid'
import Control from 'ol/control/Control'
import { createComponent } from 'solid-js'

const MenuComponent = props => {
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
                    <Menu.Item id='import-tracks'>
                        Import tracks
                    </Menu.Item>
                    <Menu.Item id='import-grids'>
                        Import Grid
                    </Menu.Item>
                    <MenuSeparator/>
                    <Menu.Item id='print' onclick={()=> window.print()}>
                        Print
                    </Menu.Item>
                    <MenuSeparator/>
                    <Menu.Item id='about'>
                        About
                    </Menu.Item>
                    <MenuSeparator/>
                    <Menu.Item id='exit'>
                        Log in
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
        </div>
    )
}

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