<!-- Table 表格组件 -->
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
          <!-- 控制列宽 -->
          <colgroup>
            <col
              v-for="column in leafColumns"
              :key="column.id"
              :style="{ width: `${getColumnRealWidth(column)}px` }"
            />
          </colgroup>
          <thead :class="ns.is('group', isGroup)">
            <tr
              v-for="(subColumns, rowIndex) in columnRows"
              :key="rowIndex"
            >
              <th
                v-for="(column, index) in subColumns"
                :key="column.id"
                :colspan="column.colSpan"
                :rowspan="column.rowSpan"
                :class="[
                  ns.is(column.headerAlign, !!column.headerAlign),
                  ns.is('fixed-left', column.fixed === 'left'),
                  ns.is('fixed-right', column.fixed === 'right'),
                  ns.is('fixed-left-last', isLastLeftFixed(column)),
                  ns.is('fixed-right-first', isFirstRightFixed(column)),
                  ns.is('group', column.isColumnGroup),
                  ns.is('last', isLastColumn(column)),
                ]"
                :style="getColumnStyle(column)"
                @click="(event) => onHeaderCellClick(event, column)"
              >
                <div :class="ns.e('cell')">
                  <VNodeRenderer
                    :content="renderHeader(column, index)"
                  />
                  <span
                    v-if="column.sort && (!column.children || column.children.length === 0)"
                    :class="ns.e('sort-caret')"
                  >
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
            <colgroup>
              <col
                v-for="column in leafColumns"
                :key="column.id"
                :style="{ width: `${getColumnRealWidth(column)}px` }"
              />
            </colgroup>
            <tbody>
              <tr
                v-for="(row, rowIndex) in tableData"
                :key="rowIndex"
                :class="[
                  ns.e('row'),
                  ns.is('striped', isOdd(rowIndex)),
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
                      ns.is('last', cell.column.id === lastLeafColumnId),
                    ]"
                    :style="getColumnStyle(cell.column)"
                    :rowspan="cell.span.rowspan"
                    :colspan="cell.span.colspan"
                    @click="(event) => onBodyCellClick(event, row, cell.column)"
                  >
                    <div :class="ns.e('cell')">
                      <VNodeRenderer
                        :content="renderCell(row, cell.column, rowIndex)"
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

import { isOdd } from "@me-ui/utils";
import { isString } from "@me-ui/utils/types";

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

/** 渲染 VNode 的函数式组件 */
const VNodeRenderer: FunctionalComponent<{ content: VNode | VNode[] | null }> = ({ content }) => content;

/** 叶子列数据 */
const leafColumns = computed(() => store.states.leafColumns.value);

/** 将列树转换为表头行数组（计算每列的 level/colSpan/rowSpan） */
function convertToRows(originCols: TableColumnCtx<DefaultRow>[]): TableColumnCtx<DefaultRow>[][] {
  let maxLevel = 1;

  /** 计算 level 和 colSpan */
  function dfs(column: TableColumnCtx<DefaultRow>, parent?: TableColumnCtx<DefaultRow>) {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) {
        maxLevel = column.level;
      }
    }
    if (column.children && column.children.length > 0) {
      let colSpan = 0;
      column.children.forEach((subColumn) => {
        dfs(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
      column.isColumnGroup = true;
    } else {
      column.colSpan = 1;
      column.isColumnGroup = false;
    }
  }

  originCols.forEach((column) => {
    column.level = 1;
    dfs(column, undefined);
  });

  const rows: TableColumnCtx<DefaultRow>[][] = [];
  for (let i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  const allColumns = store.getAllColumns(originCols);
  allColumns.forEach((column) => {
    if (!column.isColumnGroup) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
}

/** 表头行数据（二维数组，每行对应一级表头） */
const columnRows = computed(() =>
  convertToRows(store.states.columns.value),
);

/** 是否为多级表头 */
const isGroup = computed(() => columnRows.value.length > 1);

/** 表格数据（计算属性确保模板响应性） */
const tableData = computed(() => store.states.data.value);

/** 是否为空 */
const isEmpty = computed(() => tableData.value.length === 0);

/** 是否有固定列 */
const hasFixedColumns = computed(() =>
  leafColumns.value.some((col) => col.fixed),
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
  const cols = leafColumns.value;
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

  // 分组列的偏移量取其第一个/最后一个叶子列的偏移量
  const allColumns = store.getAllColumns(store.states.columns.value);
  allColumns.forEach((column) => {
    if (column.fixed && column.children && column.children.length > 0) {
      const leaves = store.getLeafColumns(column);
      if (leaves.length > 0) {
        const targetLeaf = column.fixed === 'left' ? leaves[0] : leaves[leaves.length - 1];
        offsets[column.id] = offsets[targetLeaf.id] ?? 0;
      }
    }
  });

  return offsets;
});

/** 最后一个叶子列 ID */
const lastLeafColumnId = computed(() => {
  const cols = leafColumns.value;
  return cols.length > 0 ? cols[cols.length - 1].id : null;
});

/** 判断列是否为最后一列（支持分组列） */
function isLastColumn(column: TableColumnCtx<DefaultRow>): boolean {
  if (!column.children || column.children.length === 0) {
    return column.id === lastLeafColumnId.value;
  }
  const leaves = store.getLeafColumns(column);
  const lastLeaf = leaves[leaves.length - 1];
  return !!lastLeaf && lastLeaf.id === lastLeafColumnId.value;
}

/** 最后一个左固定列 ID */
const lastLeftFixedColumnId = computed(() => {
  const cols = leafColumns.value;
  for (let i = cols.length - 1; i >= 0; i--) {
    if (cols[i].fixed === "left") {
      return cols[i].id;
    }
  }
  return null;
});

/** 第一个右固定列 ID */
const firstRightFixedColumnId = computed(() => {
  const cols = leafColumns.value;
  for (let i = 0; i < cols.length; i++) {
    const col = cols[i];
    if (col.fixed === "right") {
      return col.id;
    }
  }
  return null;
});

/** 判断列是否为最后一个左固定列（支持分组列） */
function isLastLeftFixed(column: TableColumnCtx<DefaultRow>): boolean {
  if (column.fixed !== "left") return false;
  if (!column.children || column.children.length === 0) {
    return column.id === lastLeftFixedColumnId.value;
  }
  const leaves = store.getLeafColumns(column);
  const lastLeaf = leaves[leaves.length - 1];
  return !!lastLeaf && lastLeaf.id === lastLeftFixedColumnId.value;
}

/** 判断列是否为第一个右固定列（支持分组列） */
function isFirstRightFixed(column: TableColumnCtx<DefaultRow>): boolean {
  if (column.fixed !== "right") return false;
  if (!column.children || column.children.length === 0) {
    return column.id === firstRightFixedColumnId.value;
  }
  const leaves = store.getLeafColumns(column);
  const firstLeaf = leaves[0];
  return !!firstLeaf && firstLeaf.id === firstRightFixedColumnId.value;
}

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

/** 获取列样式（固定列偏移量，支持分组列） */
function getColumnStyle(column: TableColumnCtx<DefaultRow>): CSSProperties {
  const style: CSSProperties = {};

  if (column.fixed) {
    const offset = fixedColumnOffsets.value[column.id] ?? 0;
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
    columnIndex,
    store,
  });
  if (isString(result)) {
    return h("span", null, result);
  }
  return result;
}

/** 渲染单元格（确保返回 VNode，并传递 store） */
function renderCell(
  row: DefaultRow,
  column: TableColumnCtx<DefaultRow>,
  rowIndex: number,
) {
  const result = column.renderCell({
    row,
    column,
    rowIndex,
    store,
  });
  if (isString(result)) {
    return h("span", null, result);
  }
  return result;
}

/** 获取行单元格列表（含合并跨度信息） */
function getRowCells(row: DefaultRow, rowIndex: number) {
  return leafColumns.value.map((column, columnIndex) => ({
    column,
    span: getSpan(row, column, rowIndex, columnIndex),
  }));
}

/** 获取合并跨度 */
function getSpan(
  row: DefaultRow,
  column: TableColumnCtx<DefaultRow>,
  rowIndex: number,
  columnIndex: number,
): SpanInfo {
  let rowspan = 1;
  let colspan = 1;
  if (typeof props.spanMethod === "function") {
    const result = props.spanMethod({
      row,
      rowIndex,
      column,
      columnIndex,
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
  store.states.selection,
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
  store.states.leafColumns,
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
