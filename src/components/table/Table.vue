<!-- ? Table 表格组件 -->
<template>
  <div
    ref="tableWrapperRef"
    :class="[
      ns.b.value,
      ns.is('striped', true),
      ns.is('border', true),
      ns.m(actualSize),
    ]"
  >
    <div
      :class="[
        ns.e('inner-wrapper'),
        ns.is('scrolling-left', isScrollingLeft),
        ns.is('scrolling-right', isScrollingRight),
        ns.is('scrolling-middle', isScrollingMiddle),
      ]"
    >
      <!-- 列插槽（仅提供列配置信息，不渲染任何dom） -->
      <slot></slot>

      <!-- 表头 -->
      <div ref="headerWrapperRef" :class="ns.e('header-wrapper')">
        <table :class="ns.e('header')" :style="{ width: bodyWidth }">
          <thead>
            <tr>
              <th
                v-for="(column, columnIndex) in tableColumns"
                :key="column.id"
                :class="[
                  ns.is(column.align, !!column.align),
                  ns.is('fixed-left', column.fixed === 'left'),
                  ns.is('fixed-right', column.fixed === 'right'),
                  ns.is('fixed-left-last', column.id === lastLeftFixedColumnId),
                  ns.is(
                    'fixed-right-first',
                    column.id === firstRightFixedColumnId,
                  ),
                ]"
                :style="getColumnStyle(column)"
                @click="(event) => onHeaderCellClick(event, column)"
              >
                <div :class="ns.e('cell')">
                  <VNodeRenderer :content="renderHeader(column, columnIndex)" />
                  <span v-if="column.sort" :class="ns.e('sort-caret')">
                    <i
                      :class="[
                        ns.em('sort-caret', 'ascending'),
                        ns.is('active', column.order === 'ascending'),
                      ]"
                      @click.stop="handleSortClick(column, 'ascending')"
                    ></i>
                    <i
                      :class="[
                        ns.em('sort-caret', 'descending'),
                        ns.is('active', column.order === 'descending'),
                      ]"
                      @click.stop="handleSortClick(column, 'descending')"
                    ></i>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <!-- 表体 -->
      <div :class="ns.e('body-wrapper')">
        <me-scrollbar
          ref="scrollbarRef"
          :max-height="maxHeight"
          :height="height"
          @scroll="onBodyScroll"
        >
          <table :class="ns.e('body')" :style="{ width: bodyWidth }">
            <tbody>
              <tr
                v-for="(row, rowIndex) in tableData"
                :key="rowIndex"
                :class="[
                  ns.e('row'),
                  ns.is('striped', rowIndex % 2 === 1),
                  ns.is('current', store.states.currentRow.value === row),
                ]"
              >
                <template
                  v-for="cell in getRowCells(row, rowIndex)"
                  :key="cell.column.id"
                >
                  <td
                    v-if="cell.span.rowspan && cell.span.colspan"
                    :class="[
                      ns.is(cell.column.align, !!cell.column.align),
                      ns.is('fixed-left', cell.column.fixed === 'left'),
                      ns.is('fixed-right', cell.column.fixed === 'right'),
                      ns.is(
                        'fixed-left-last',
                        cell.column.id === lastLeftFixedColumnId,
                      ),
                      ns.is(
                        'fixed-right-first',
                        cell.column.id === firstRightFixedColumnId,
                      ),
                    ]"
                    :style="getColumnStyle(cell.column)"
                    :rowspan="cell.span.rowspan"
                    :colspan="cell.span.colspan"
                    @click="(event) => onBodyCellClick(event, row, cell.column)"
                  >
                    <div :class="ns.e('cell')">
                      <VNodeRenderer
                        :content="renderCell(row, cell.column, rowIndex, cell.cellIndex)"
                      />
                    </div>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>

          <!-- 空数据 -->
          <div v-if="isEmpty" :class="ns.e('empty-block')">
            <slot name="empty">
              <span :class="ns.e('empty-text')">暂无数据</span>
            </slot>
          </div>
        </me-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  h,
  onMounted,
  provide,
  ref,
  watch,
} from "vue";
import type { CSSProperties, FunctionalComponent, VNode } from "vue";

import { useFormSize } from "@me-ui/components/form/hooks";
import { useNamespace } from "@me-ui/hooks/use-namespace";
import { useResizeObserver } from "@vueuse/core";

import MeScrollbar from "@me-ui/components/scrollbar";
import type MeScrollbarType from "@me-ui/components/scrollbar";

import { tableEmits, tableProps } from "./table";
import type { DefaultRow, SpanInfo, TableColumnCtx, TableSortOrder } from "./types";
import { SORT_ORDERS, TABLE_INJECTION_KEY, TABLE_NAMESPACE, createTableId } from "./constants";
import { useTableStore } from "./store";

defineOptions({ name: "MeTable" });

const props = defineProps(tableProps);
const emit = defineEmits(tableEmits);

const ns = useNamespace(TABLE_NAMESPACE);

/** 实际尺寸 */
const actualSize = useFormSize(computed(() => props.size));

/** Table ID */
const tableId = createTableId(ns.namespace);

/** Store */
const store = useTableStore();

/** 提供 Table 上下文 */
provide(TABLE_INJECTION_KEY, {
  tableId,
  store,
  props,
  emit,
});

/** 表格包装器引用 */
const tableWrapperRef = ref<HTMLElement>();

/** 表头包装器引用 */
const headerWrapperRef = ref<HTMLElement>();

/** 滚动条组件引用 */
const scrollbarRef = ref<InstanceType<typeof MeScrollbarType>>();

/** 当前水平滚动位置 */
const scrollLeft = ref(0);

/** 最大水平滚动距离 */
const maxScrollLeft = ref(0);

/** 渲染 VNode 的辅助组件 */
const VNodeRenderer: FunctionalComponent<{ content: VNode | VNode[] | null }> = ({ content }) => content;

/** 列数据（计算属性确保模板响应性） */
const tableColumns = computed(() => store.states.columns.value);

/** 表格数据（计算属性确保模板响应性） */
const tableData = computed(() => store.states.data.value);

/** 是否为空 */
const isEmpty = computed(() => tableData.value.length === 0);

/** 是否有固定列 */
const hasFixedColumns = computed(() =>
  tableColumns.value.some((col) => col.fixed),
);

/** 获取列实际渲染宽度 */
function getColumnRealWidth(column: TableColumnCtx<DefaultRow>): number {
  if (column.realWidth !== null && !Number.isNaN(column.realWidth)) {
    return column.realWidth;
  }
  const width = Number(column.width);
  // 布局前的兜底值使用 minWidth，布局完成后将使用列的真实宽度
  return Number.isNaN(width) ? column.minWidth : width;
}

/** 固定列偏移量映射 */
const fixedColumnOffsets = computed(() => {
  const cols = tableColumns.value;
  const offsets: Record<string, number> = {};
  let leftOffset = 0;
  let rightOffset = 0;

  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    if (col.fixed === "left") {
      offsets[col.id] = leftOffset;
      leftOffset += getColumnRealWidth(col);
    }
  }

  for (let i = cols.length - 1; i >= 0; i--) {
    const col = cols[i];
    if (col.fixed === "right") {
      offsets[col.id] = rightOffset;
      rightOffset += getColumnRealWidth(col);
    }
  }

  return offsets;
});

/** 最后一个左固定列 ID */
const lastLeftFixedColumnId = computed(() => {
  const cols = tableColumns.value;
  for (let i = cols.length - 1; i >= 0; i--) {
    if (cols[i].fixed === "left") {
      return cols[i].id;
    }
  }
  return null;
});

/** 第一个右固定列 ID */
const firstRightFixedColumnId = computed(() => {
  const cols = tableColumns.value;
  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    if (col.fixed === "right") {
      return col.id;
    }
  }
  return null;
});

/** 是否有横向滚动 */
const hasScrollX = computed(() => store.states.scrollX.value);

/** 是否滚动到最左边 */
const isScrollingLeft = computed(
  () => hasFixedColumns.value && hasScrollX.value && scrollLeft.value === 0,
);

/** 是否滚动到最右边 */
const isScrollingRight = computed(
  () =>
    hasFixedColumns.value &&
    hasScrollX.value &&
    scrollLeft.value >= maxScrollLeft.value - 1 &&
    !isScrollingLeft.value,
);

/** 是否处于中间滚动状态（左右都有阴影） */
const isScrollingMiddle = computed(
  () =>
    hasFixedColumns.value &&
    hasScrollX.value &&
    !isScrollingLeft.value &&
    !isScrollingRight.value,
);

/** 表体宽度（使用 store 计算的 bodyWidth） */
const bodyWidth = computed(() => {
  const w = store.states.bodyWidth.value;
  return w ? `${w}px` : "100%";
});

/** 获取列样式（宽度 + 固定列偏移量） */
function getColumnStyle(column: TableColumnCtx<DefaultRow>): CSSProperties {
  const style: CSSProperties = {};

  const width = column.realWidth ?? column.width;
  if (width !== undefined && width !== null) {
    style.width = `${width}px`;
  } else if (column.minWidth) {
    style.minWidth = `${column.minWidth}px`;
  }

  if (column.fixed) {
    const offset = fixedColumnOffsets.value[column.id] || 0;
    if (column.fixed === "left") {
      style.left = `${offset}px`;
    } else {
      style.right = `${offset}px`;
    }
  }

  return style;
}

/** 表体滚动事件 */
function onBodyScroll(_scrollTop: number, scrollLeftVal: number) {
  scrollLeft.value = scrollLeftVal;
  // 表头使用的是单独的table，横向滚动时需要同步滑动表头
  if (headerWrapperRef.value) {
    headerWrapperRef.value.scrollLeft = scrollLeftVal;
  }
}

/** 执行布局：测量容器宽度并计算列宽 */
function doLayout() {
  const el = tableWrapperRef.value;
  if (!el) return;
  const containerWidth = el.clientWidth;
  store.updateColumnsWidth(containerWidth);
  // 更新最大水平滚动距离
  const wrap = scrollbarRef.value?.wrapRef;
  if (wrap) {
    maxScrollLeft.value = wrap.scrollWidth - wrap.clientWidth;
  }
}

/** 监听容器尺寸变化，重新计算列宽 */
useResizeObserver(tableWrapperRef, doLayout);

/** 渲染表头（确保返回 VNode） */
function renderHeader(column: TableColumnCtx<DefaultRow>, columnIndex: number) {
  const result = column.renderHeader({
    column,
    $index: columnIndex,
    store,
  });
  if (typeof result === "string") {
    return h("span", null, result);
  }
  return result;
}

/** 渲染单元格（确保返回 VNode，并传递 store） */
function renderCell(
  row: DefaultRow,
  column: TableColumnCtx<DefaultRow>,
  rowIndex: number,
  cellIndex: number,
) {
  const result = column.renderCell({
    row,
    column,
    $index: rowIndex,
    cellIndex,
    store,
  });
  if (typeof result === "string") {
    return h("span", null, result);
  }
  return result;
}

/** 获取行单元格列表（含合并跨度信息） */
function getRowCells(row: DefaultRow, rowIndex: number) {
  return tableColumns.value.map((column, cellIndex) => ({
    column,
    cellIndex,
    span: getSpan(row, column, rowIndex, cellIndex),
  }));
}

/** 获取合并跨度 */
function getSpan(
  row: DefaultRow,
  column: TableColumnCtx<DefaultRow>,
  rowIndex: number,
  cellIndex: number,
): SpanInfo {
  let rowspan = 1;
  let colspan = 1;
  if (typeof props.spanMethod === "function") {
    const result = props.spanMethod({
      row,
      rowIndex,
      column,
      columnIndex: cellIndex,
    });
    rowspan = result.rowspan;
    colspan = result.colspan;
  }
  return { rowspan, colspan };
}

/** 表头单元格点击 */
function onHeaderCellClick(
  event: PointerEvent,
  column: TableColumnCtx<DefaultRow>,
) {
  if (column.sort) {
    handleSortClick(column);
  }
  emit("header-cell-click", column, event);
}

/** 排序点击 */
function handleSortClick(
  column: TableColumnCtx<DefaultRow>,
  targetOrder?: TableSortOrder,
) {
  let newOrder: TableSortOrder | null;

  if (targetOrder) {
    // 点击具体箭头：相同方向则取消，不同方向则设置
    newOrder = column.order === targetOrder ? null : targetOrder;
  } else {
    // 点击表头：按默认顺序循环
    const orders = SORT_ORDERS;
    const currentIndex = orders.indexOf(column.order);
    const nextIndex = (currentIndex + 1) % orders.length;
    newOrder = orders[nextIndex] ?? null;
  }

  store.updateSort(column, column.name, newOrder);
  store.execSort();
  emit("sort-change", { column, name: column.name, order: newOrder });
}

/** 设置当前行 */
function setCurrentRow(row: DefaultRow | null) {
  const { oldCurrentRow } = store.setCurrentRow(row);
  if (oldCurrentRow !== row) {
    emit("current-change", row, oldCurrentRow);
  }
}

/** 表体单元格点击（同时处理行选中逻辑） */
function onBodyCellClick(
  event: PointerEvent,
  row: DefaultRow,
  column: TableColumnCtx<DefaultRow>,
) {
  const isSameRow = store.states.currentRow.value === row;
  setCurrentRow(isSameRow ? null : row);
  emit("body-cell-click", row, column, event);
}

/** 监听 selection 变化，向外 emit 事件 */
watch(
  () => store.states.selection.value,
  (newSelection) => {
    emit("selection-change", newSelection);
  },
);

/** 监听 data 变化 */
watch(
  () => props.data,
  (newData) => {
    store.setData(newData);
  },
  { immediate: true }
);

/** 监听列变化，重新计算列宽 */
watch(
  () => store.states.columns.value,
  doLayout,
  { flush: "post" },
);

/** 初始布局 */
onMounted(() => {
  doLayout();
});

/** 暴露方法 */
defineExpose({
  /** 执行布局 */
  doLayout,
  /** Store 实例 */
  store,
  /** 清空选择 */
  clearSelection: store.clearSelection,
  /** 获取选中行 */
  getSelectionRows: store.getSelectionRows,
  /** 切换全选 */
  toggleAllSelection: () => {
    store.toggleAllSelection();
    emit("select-all", store.getSelectionRows());
  },
  /** 切换行选中 */
  toggleRowSelection: store.toggleRowSelection,
  /** 清除排序 */
  clearSort: store.clearSort,
  /** 设置当前行 */
  setCurrentRow,
});
</script>
