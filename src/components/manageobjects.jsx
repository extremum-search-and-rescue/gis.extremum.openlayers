import { For, Show, createMemo, createSignal } from 'solid-js';
import { createSolidTable, flexRender, getCoreRowModel } from '@tanstack/solid-table';
import { Config } from '../config';
import { Checkbox, Dialog } from '@ark-ui/solid';
import { Portal } from 'solid-js/web';
import { useService } from 'solid-services';
import { LayerService } from '../services/layerservice';
import { createStore } from 'solid-js/store';

const ObjectTable = (props) => {
  const features = [...props.layerService.userObjectsLayer.getFeatures(), ...props.layerService.userDrawingLayer.getFeatures()];
  const [rowSelection, setRowSelection] = createSignal({});
  
  function getGeometryName(feature){
    return 'Point ??';
  }
  function getCenter(feature){
    return [0,0];
  }
  const colDefs = createMemo(()=> [
    {
      id: 'select',
      header: (context) => (
        <Checkbox.Root
          checked={() => context.table.getIsAllRowsSelected() 
            ? true 
            : table.getIsSomeRowsSelected() 
              ? 'indeterminate'
              : false
          }
          onCheckedChange={()=> context.table.getToggleAllRowsSelectedHandler()}>
          <Checkbox.Control/>
        </Checkbox.Root>
      ),
      cell: (context) => (
        <Show when={()=> !context.row.getCanSelect()}>
          <Checkbox.Root
            onCheckedChange={() => context.row.getToggleSelectedHandler()}>
            <Checkbox.Control/>
          </Checkbox.Root>
        </Show>
      ),
    },
    {
      accessorFn: (feature, i) => getGeometryName(feature),
      header: 'type',
      cell: info => info.getValue()
    },
    {
      accessorFn: (feature, i) => getCenter(feature),
      header: 'coordinates',
      cell: info => info.getValue()
    },
  ]);

  const table = createSolidTable({
    data: features,
    enableRowSelection: true,
    state: {
      rowSelection
    },
    columns: colDefs(),
    getCoreRowModel: getCoreRowModel(),
    debugAll: Config.IS_DEVELOPMENT,
    onRowSelectionChange: (e) => setRowSelection(e)
  },[]);
  
  const stateOfRowSelection = ()=> table.getState().rowSelection;

  return (
    <table class='manageobjects'>
      <thead>
        <For each={table.getHeaderGroups()}>
          {headerGroup => (
            <tr data-scope='header' data-part='row'>
              <For each={headerGroup.headers}>
                {header => (
                  <th data-scope='header' data-part='cell'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                )}
              </For>
            </tr>
          )}
        </For>
      </thead>
      <tbody>
        <For each={table.getRowModel().rows}>{row => {
          return (
            <tr data-scope='rows' data-part='row'>
              <For each={row.getVisibleCells()}>{cell => {
                return(
                  <td data-scope='rows' data-part='cell'>
                    {flexRender(cell.column.columnDef.cell,cell.getContext()
                    )}
                  </td>
                );
              }}</For>
            </tr>
          );
        }}
        </For>
      </tbody>
      <tfoot>
        <tr>
          <td>{()=> 
            JSON.stringify(stateOfRowSelection(), null, 2)}
          </td>
        </tr>
      </tfoot>
    </table>);
};

export const ManageObjects = (props) => {
  const layerService = useService(LayerService);
  return (
    <Dialog.Root modal={true} open={props.isOpen()} onExitComplete={()=>props.setOpen(false)}>
      <Portal mount={document.getElementById('modal-overlay')}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content class='manageobjects'>  
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