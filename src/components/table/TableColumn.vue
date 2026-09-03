<!-- ? TableColumn 表格列组件（不渲染可见 DOM，仅提供列配置和嵌套列渲染） -->
<template>
  <slot></slot>
</template>

<script lang="ts" setup>
import { h, inject, onBeforeMount, onBeforeUnmount, onMounted, provide, ref } from 'vue';

import { get } from 'lodash';

import type { VNode } from 'vue';

import MeCheckbox from '@me-ui/components/checkbox';

import { tableColumnProps } from './table-column';
import type { TableColumnSlots } from './table-column';
import type { DefaultRow, TableCellData, TableCellRenderData, TableColumnCtx, TableHeaderData } from './types';
import { TABLE_COLUMN_INJECTION_KEY, TABLE_INJECTION_KEY, createColumnId } from './constants';
import type { TableStore } from './store';

defineOptions({ name: 'MeTableColumn' });

const props = defineProps(tableColumnProps);

const slots = defineSlots<TableColumnSlots>();

/** 注入 Table 上下文 */
const parent = inject(TABLE_INJECTION_KEY);

if (!parent) {
  throw new Error('[MeTableColumn] 必须在 MeTable 组件内使用');
}

const { store, tableId, emit } = parent;

/** 注入父列上下文 */
const parentColumn = inject(TABLE_COLUMN_INJECTION_KEY, undefined);

/** 列配置 */
const columnConfig = ref<TableColumnCtx<DefaultRow>>({} as TableColumnCtx<DefaultRow>);

/** 提供列上下文给子列 */
provide(TABLE_COLUMN_INJECTION_KEY, columnConfig);

/** 渲染单元格值 */
function renderCellValue(data: TableCellData): string | VNode | VNode[] {
  const { row, column, rowIndex } = data;
  const property = column.name;
  const value = property ? get(row, property) : undefined;
  if (column.formatter) {
    return column.formatter(row, column, value, rowIndex);
  }
  return value?.toString?.() || '';
}

/** selection 列渲染表头 */
function selectionRenderHeader(store: TableStore<DefaultRow>): VNode {
  return h(MeCheckbox, {
    modelValue: store.states.isAllSelected.value,
    indeterminate: store.states.selection.value.length > 0 && !store.states.isAllSelected.value,
    onChange: () => {
      store.toggleAllSelection();
      emit('select-all', store.getSelectionRows());
    },
  });
}

/** selection 列渲染单元格 */
function selectionRenderCell(data: TableCellRenderData): string | VNode | VNode[] {
  const { row, column, rowIndex, store } = data;
  return h(MeCheckbox, {
    modelValue: store.isSelected(row),
    disabled: column.selectable ? !column.selectable(row, rowIndex) : false,
    onChange: () => {
      store.toggleRowSelection(row);
      emit('select', store.getSelectionRows(), row);
    },
    onClick: (event: Event) => event.stopPropagation(),
  });
}

/** 默认列渲染表头 */
function defaultRenderHeader(scope: TableHeaderData): string | VNode | VNode[] {
  if (slots.header) {
    return slots.header(scope);
  }
  return props.label;
}

/** 默认列渲染单元格 */
function defaultRenderCell(data: TableCellData): string | VNode | VNode[] {
  if (slots.body) {
    return slots.body(data);
  }
  return renderCellValue(data);
}

onBeforeMount(() => {
  const type = props.type;
  const isSelection = type === 'selection';

  const column: TableColumnCtx<DefaultRow> = {
    id: createColumnId(tableId),
    type,
    label: props.label,
    name: props.name,
    align: props.align,
    headerAlign: props.headerAlign ?? props.align,
    sort: isSelection ? false : props.sort,
    order: null,
    formatter: props.formatter,
    selectable: props.selectable,
    width: store.parseWidth(props.width),
    realWidth: store.parseWidth(props.width) ?? null,
    minWidth: props.minWidth,
    fixed: props.fixed,
    renderHeader: isSelection
      ? ({ store }) => selectionRenderHeader(store)
      : (scope) => defaultRenderHeader(scope),
    renderCell: isSelection
      ? (data) => selectionRenderCell(data)
      : (data) => defaultRenderCell(data),
    isSubColumn: !!parentColumn,
    // 以下均为临时设置的初始值
    children: [],
    level: 1,
    colSpan: 1,
    rowSpan: 1,
    isColumnGroup: false,
  };

  columnConfig.value = column;
});

onMounted(() => {
  store.insertColumn(columnConfig.value, parentColumn?.value);
});

onBeforeUnmount(() => {
  store.removeColumn(columnConfig.value, parentColumn?.value);
});
</script>
