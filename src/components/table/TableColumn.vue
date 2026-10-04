<!-- TableColumn 表格列组件（不渲染可见 DOM，仅提供列配置和嵌套列渲染） -->
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

defineOptions({ name: 'MeTableColumn' });

const props = defineProps(tableColumnProps);

const slots = defineSlots<TableColumnSlots>();

/** 注入 Table 上下文 */
const parent = inject(TABLE_INJECTION_KEY);

if (!parent) {
  throw new Error('[MeTableColumn] 必须在 MeTable 组件内使用');
}

const { store, tableId, emit } = parent;

const {
  isAllSelected,
  selection,
  toggleAllSelection,
  toggleRowSelection,
  insertColumn,
  removeColumn,
} = store;

/** 注入父列上下文 */
const parentColumn = inject(TABLE_COLUMN_INJECTION_KEY, undefined);

/** 列配置 */
const columnConfig = ref<TableColumnCtx<DefaultRow> | undefined>();

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

/** selection 列渲染表头单元格 */
function selectionRenderHeaderCell(): VNode {
  return h(MeCheckbox, {
    modelValue: isAllSelected.value,
    indeterminate: selection.value.length > 0 && !isAllSelected.value,
    onChange() {
      toggleAllSelection();
      emit('select-all', selection.value.slice());
    },
  });
}

/** selection 列渲染表体单元格 */
function selectionRenderBodyCell(data: TableCellRenderData): string | VNode | VNode[] {
  const { row, column, rowIndex } = data;
  return h(MeCheckbox, {
    modelValue: selection.value.includes(row),
    disabled: column.selectableFn ? !column.selectableFn(row, rowIndex) : false,
    onChange() {
      toggleRowSelection(row);
      emit('select', selection.value.slice(), row);
    },
    onClick(event: Event) {
      event.stopPropagation()
    }
  });
}

/** 默认列渲染表头单元格 */
function defaultRenderHeaderCell(data: TableHeaderData): string | VNode | VNode[] {
  if (slots.header) {
    return slots.header(data);
  }
  return props.label;
}

/** 默认列渲染表体单元格 */
function defaultRenderBodyCell(data: TableCellData): string | VNode | VNode[] {
  if (slots.body) {
    return slots.body(data);
  }
  return renderCellValue(data);
}

onBeforeMount(() => {
  const type = props.type;
  const isSelection = type === 'selection';
  
  // 在beforeMount中初始化列配置对象，为了让后代列能够inject得到（父beforeMounted早于子beforeMounted）
  const column: TableColumnCtx<DefaultRow> = {
    // 列id包含tableId，方便调试
    id: createColumnId(tableId),
    type,
    label: props.label,
    name: props.name,
    align: props.align,
    headerAlign: props.headerAlign ?? props.align,
    // 对选择列设置排序规则没有意义，因为无法比较
    sort: isSelection ? false : props.sort,
    formatter: props.formatter,
    selectableFn: props.selectableFn,
    width: props.width,
    realWidth: props.width ?? null,
    minWidth: props.minWidth,
    fixed: props.fixed,
    renderHeaderCell: isSelection
      ? () => selectionRenderHeaderCell()
      : (data) => defaultRenderHeaderCell(data),
    renderBodyCell: isSelection
      ? (data) => selectionRenderBodyCell(data)
      : (data) => defaultRenderBodyCell(data),
    isSubColumn: !!parentColumn,
    // 以下为临时设置的初始值
    order: null,
    children: [],
    level: 1,
    colSpan: 1,
    rowSpan: 1,
    isColumnGroup: false,
  };

  columnConfig.value = column;
});

onMounted(() => {
  // mounted时刻，后代配置对象均已初始化完成，此时插入进去的就是完整的列树结构（子mounted早于父mounted）
  insertColumn(columnConfig.value!, parentColumn?.value);
});

onBeforeUnmount(() => {
  // 删除时机无所谓遵循特定顺序，在组件完全卸载前remove配置是最合适的
  removeColumn(columnConfig.value!, parentColumn?.value);
});
</script>
