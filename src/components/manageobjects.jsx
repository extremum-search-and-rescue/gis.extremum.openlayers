import { For, Show, createEffect, createMemo, createSignal } from 'solid-js';
import { createSolidTable, flexRender, getCoreRowModel } from '@tanstack/solid-table';
import { Checkbox, Dialog } from '@ark-ui/solid';
import { Portal } from 'solid-js/web';
import { useService } from 'solid-services';
import { LayerService } from '../services/layerservice';
import { createStore } from 'solid-js/store';

const ObjectTable = (props) => {
  const features = () => [...props.layerService.userObjectsLayer.getFeatures(), ...props.layerService.userDrawingLayer.getFeatures()];
  
  function getGeometryName(feature){
    return 'Point ??';
  }
  function getCenter(feature){
    return [0,0];
  }
  const [isAllRowsSelected, setAllRowsSelected] = createSignal(false);
  const [isSomeRowsSelected, setSomeRowsSelected] = createSignal(false);
  const [rowSelection, setRowSelection] = createStore({});
  const [rowCount, setRowCount] = createSignal(0);
  const multiselectDisabled = () => rowCount() == 0;
  const colDefs = createMemo(()=> [
    {
      id: 'select',
      header: (context) => (
        <Checkbox.Root
          disabled={multiselectDisabled()}
          checked={isAllRowsSelected()}
          onClick={context.table.getToggleAllRowsSelectedHandler()}>
          <Checkbox.Control/>
        </Checkbox.Root>
      ),
      class: 'checkbox',
      cell: (context, i) => (
        <Checkbox.Root
          //checked={context.row.getIsSelected()}
          onClick={context.row.getToggleSelectedHandler()}>
          <Checkbox.Control/>
        </Checkbox.Root>
      ),
    },
    {
      accessorFn: (feature, i) => getGeometryName(feature),
      header: 'type',
      class: 'text',
      cell: info => info.getValue()
    },
    {
      accessorFn: (feature, i) => getCenter(feature),
      header: 'coordinates',
      class: 'text',
      cell: info => info.getValue()
    },
  ]);

  const table = createSolidTable({
    data: features(),
    enableRowSelection: true,
    state: { rowSelection: rowSelection },
    onRowSelectionChange: setRowSelection,
    columns: colDefs(),
    getCoreRowModel: getCoreRowModel(),
  },[]);

  createEffect(()=> {
    console.log(JSON.stringify(rowSelection));
    const allRowsSelectedState = table.getIsAllRowsSelected() 
      ? true 
      : table.getIsSomeRowsSelected() 
        ? 'indeterminate'
        : false;
    setSomeRowsSelected(table.getIsAllRowsSelected() || table.getIsSomeRowsSelected());
    console.log(allRowsSelectedState);
    setAllRowsSelected(allRowsSelectedState);
    setRowCount(table.getRowCount());
    //setTableState(table.getState());
  });

  return (
    <>
      <div style={{'display':'flex','gap':'0.5rem'}}>
        <button data-dd-action-name="manageobjects: del" data-scope='dialog' disabled={!isSomeRowsSelected()}>
          Del
        </button>
        <button data-dd-action-name="manageobjects: copy" data-scope='dialog' disabled={!isSomeRowsSelected()}>
          Copy
        </button>
      </div>
      <div class='manageobjects'>
        <For each={table.getHeaderGroups()}>
          {(headerGroup) => (
            <div data-scope='header' data-part='row' style={{'grid-row': 1}}>
              <For each={headerGroup.headers}>
                {(header,c) => (
                  <div style={{'grid-column': c()+1}}  data-scope='header' data-part='cell' class={header.column.columnDef.class ?? ''}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
        <For each={table.getRowModel().rows}>{(row, r) => {
          return (
            <div data-scope='rows' data-part='row' style={{'grid-row': r()+2}} >
              <For each={row.getVisibleCells()}>{(cell, c) => {
                return(
                  <div style={{'grid-column': c()+1}} data-scope='rows' data-part='cell' class={cell.column.columnDef.class ?? ''}>
                    {flexRender(cell.column.columnDef.cell,cell.getContext()
                    )}
                  </div>
                );
              }}</For>
            </div>
          );
        }}
        </For>
      </div>
      <div>
        <div>{()=> 
          JSON.stringify(table.getState().rowSelection, null, 2)}
        </div>
      </div>
    </>);
};

export const ManageObjects = (props) => {
  const layerService = useService(LayerService);
  return (
    <Dialog.Root 
      modal={true} 
      open={props.isOpen()} 
      onExitComplete={()=>props.setOpen(false)}>
      <Portal mount={document.getElementById('modal-overlay')}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content class='manageobjects-dialog'>  
            <Show when={props.isOpen()}>
              <>
                <div class='toolbar'>
                  <Dialog.CloseTrigger data-dd-action-name="manageobjects: close">Закрыть</Dialog.CloseTrigger>
                </div>
                <ObjectTable layerService={layerService()} />
              </>
            </Show>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};