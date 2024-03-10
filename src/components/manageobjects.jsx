import { For, Show, createEffect, createMemo, createSignal } from 'solid-js';
import { createSolidTable, flexRender, getCoreRowModel } from '@tanstack/solid-table';
import { Checkbox, Dialog } from '@ark-ui/solid';
import { Portal } from 'solid-js/web';
import { useService } from 'solid-services';
import { LayerService } from '../services/layerservice';

const ObjectTable = (props) => {
  const features = [...props.layerService.userObjectsLayer.getFeatures(), ...props.layerService.userDrawingLayer.getFeatures()];
  
  function getGeometryName(feature){
    return 'Point ??';
  }
  function getCenter(feature){
    return [0,0];
  }
  const [isAllRowsSelected, setAllRowsSelected] = createSignal(false);
  const [rowCount, setRowCount] = createSignal(0);
  const multiselectDisabled = () => rowCount() == 0;
  const colDefs = createMemo(()=> [
    {
      id: 'select',
      header: ''/*(context) => (
        <Checkbox.Root
          disabled={multiselectDisabled()}
          checked={isAllRowsSelected()}
          onCheckedChange={(e)=> context.table.toggleAllRowsSelected(e.checked)}>
          <Checkbox.Control/>
        </Checkbox.Root>
      )*/,
      class: 'checkbox',
      cell: (context) => (
        <Checkbox.Root
          onCheckedChange={(e) => context.row.toggleSelected(e.checked)}>
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
    data: features,
    enableRowSelection: true,
    columns: colDefs(),
    getCoreRowModel: getCoreRowModel(),
  },[]);

  createEffect(()=> {
    console.log(JSON.stringify(table.getState().rowSelection));
    const allRowsSelectedState = table.getIsAllRowsSelected() 
      ? true 
      : table.getIsSomeRowsSelected() 
        ? 'indeterminate'
        : false;
    console.log(allRowsSelectedState);
    setAllRowsSelected(allRowsSelectedState);
    setRowCount(table.getRowCount());
  });

  return (
    <table class='manageobjects'>
      <thead>
        <For each={table.getHeaderGroups()}>
          {headerGroup => (
            <tr data-scope='header' data-part='row'>
              <For each={headerGroup.headers}>
                {header => (
                  <th data-scope='header' data-part='cell' class={header.column.columnDef.class ?? ''}>
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
                  <td data-scope='rows' data-part='cell' class={cell.column.columnDef.class ?? ''}>
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
          <td colSpan='3'>{()=> 
            JSON.stringify(table.getState().rowSelection, null, 2)}
          </td>
        </tr>
      </tfoot>
    </table>);
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