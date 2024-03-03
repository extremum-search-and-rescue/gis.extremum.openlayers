import { Dialog } from '@ark-ui/solid';
import { createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Config } from '../config';

export const About = (props) => {
  const [offlineState, setOfflineState] = createSignal('не поддерживается');
  const [tileCacheCount, setTileCacheCount] = createSignal('?');
  const [totalMemory, setTotalMemory] = createSignal(null);

  (() => {
    const memory = window.performance && window.performance.memory;
    if(memory){
      setTotalMemory(`${(memory.totalJSHeapSize / 1048576).toFixed(1)} МБ`);
    }
  })();
  
  return (
    <Dialog.Root open={props.isOpen()} onExitComplete={()=>props.setOpen(false)}>
      <Portal 
        mount={document.getElementById('modal-overlay')}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>  
            <>
              <h1 data-scope='dialog'>ГИС для ПСО</h1>
              <h5>
                <span>Версия: </span><span>{Config.VERSION_DATE}</span><br/>
                <span>Работа без сети: </span><span>{offlineState()}</span><br/>
                <span>Хранилище: </span><span>{tileCacheCount()}</span><br/>
                <Show when={totalMemory()}><span>Память: </span><span>{totalMemory()}</span><br/></Show>
              </h5>
              <span><a data-dd-action-name="about: link-vk" href="https://vk.com/gisextremum" target="blank" data-scope='dialog'>Группа</a> в VK</span><br/>
              <span><a data-dd-action-name="about: link-telegram-chat" href="https://t.me/extremum_sas_chat" target="blank" data-scope='dialog'>Чат</a> в Telegram</span><br/>
              <a data-dd-action-name="about: link-help" href="https://help.gis.extremum.org" target="blank" data-scope='dialog'>Справка</a><br/>
              <div>Спонсоры проекта: 
                <a href="https://www.2gis.ru" target="blank" data-scope='dialog'>2ГИС</a> (геокодер), 
                <a href="https://www.yandex.ru" target="blank" data-scope='dialog'>Яндекс</a> (серверы), 
                <a target="blank" href="https://selectel.ru/services/colocation/server-colocation/" data-scope='dialog'>Selectel</a> (хостинг)
              </div>
              <hr/>
              <div style="display: flex; gap: 0.5rem">
                <button data-dd-action-name="about: update" data-scope='dialog'>Обновить</button>
                <button data-dd-action-name="about: clean-cache" data-scope='dialog'>Очистить кэш карт</button>
              </div>
              <hr/>
              <Dialog.CloseTrigger data-dd-action-name="about: close">Закрыть</Dialog.CloseTrigger>
            </>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};