import { ref } from 'vue';

import type { Ref } from 'vue';
import type { DefaultRow, TableColumnCtx, TableSortOrder } from './types';

import { get } from 'lodash';

import { isFunction } from '@me-ui/utils/types';

/** 表格 Store 状态管理 */
export function useTableStore<T extends DefaultRow = DefaultRow>() {

  /** 原始列定义 */
  const _columns: Ref<TableColumnCtx<T>[]> = ref([]);
  /** 展平后的列 */
  const columns: Ref<TableColumnCtx<T>[]> = ref([]);
  /** 原始数据 */
  const _data: Ref<T[]> = ref([]);
  /** 当前展示数据（经过排序） */
  const data: Ref<T[]> = ref([]);
  /** 是否全选 */
  const isAllSelected = ref(false);
  /** 选中的行 */
  const selection: Ref<T[]> = ref([]);
  /** 当前行 */
  const currentRow: Ref<T | null> = ref(null);
  /** 排序列 */
  const sortingColumn: Ref<TableColumnCtx<T> | null> = ref(null);
  /** 排序字段 */
  const sortName: Ref<string | null> = ref(null);
  /** 排序方向 */
  const sortOrder: Ref<TableSortOrder | null> = ref(null);
  /** selectable 函数 */
  const selectable: Ref<((row: T, index: number) => boolean) | null> = ref(null);
  /** 表体宽度（像素） */
  const bodyWidth: Ref<number> = ref(0);
  /** 是否有横向滚动 */
  const scrollX: Ref<boolean> = ref(false);

  /** 更新列（按固定状态排序：左固定 → 非固定 → 右固定） */
  function updateColumns() {
    const leftFixed: TableColumnCtx<T>[] = [];
    const nonFixed: TableColumnCtx<T>[] = [];
    const rightFixed: TableColumnCtx<T>[] = [];

    _columns.value.forEach((col) => {
      if (col.fixed === 'left') {
        leftFixed.push(col);
      } else if (col.fixed === 'right') {
        rightFixed.push(col);
      } else {
        nonFixed.push(col);
      }
    });

    columns.value = [...leftFixed, ...nonFixed, ...rightFixed];
  }

  /** 计算列宽度 */
  function updateColumnsWidth(containerWidth: number) {
    const cols = columns.value;
    if (cols.length === 0) return;

    /** 没有 width 的弹性列 */
    const flexColumns = cols.filter((col) => parseWidth(col.width) === undefined);

    let bodyMinWidth = 0;

    if (flexColumns.length > 0) {
      // 计算所有列的最小宽度总和
      cols.forEach((col) => {
        bodyMinWidth += col.width ?? col.minWidth;
      });

      if (bodyMinWidth <= containerWidth) {
        // 不需要横向滚动，弹性列分配剩余空间
        scrollX.value = false;
        const totalFlexWidth = containerWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          // 只有一个弹性列，剩余空间全部分给它
          flexColumns[0].realWidth = flexColumns[0].minWidth + totalFlexWidth;
        } else {
          // 多个弹性列，按 minWidth 比例分配剩余空间
          const allFlexMinWidth = flexColumns.reduce((prev, col) => prev + col.minWidth, 0);
          const flexWidthPerPixel = totalFlexWidth / allFlexMinWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((col, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(col.minWidth * flexWidthPerPixel);
            noneFirstWidth += flexWidth;
            col.realWidth = col.minWidth + flexWidth;
          });

          // 首列拿走剩余的全部空间，吸收取整误差保证总宽度精确
          flexColumns[0].realWidth = flexColumns[0].minWidth + totalFlexWidth - noneFirstWidth;
        }
      } else {
        // 需要横向滚动，弹性列使用 minWidth
        scrollX.value = true;
        flexColumns.forEach((col) => {
          col.realWidth = col.minWidth;
        });
      }

      bodyWidth.value = Math.max(bodyMinWidth, containerWidth);
    } else {
      // 所有列都有显式 width，直接使用 width
      cols.forEach((col) => {
        col.realWidth = col.width!;
        bodyMinWidth += col.realWidth;
      });
      scrollX.value = bodyMinWidth > containerWidth;
      bodyWidth.value = bodyMinWidth;
    }
  }

  /** 插入列 */
  function insertColumn(column: TableColumnCtx<T>) {
    if (column.type === 'selection' && _columns.value.some((col) => col.type === 'selection')) {
      console.warn('[MeTable] 只允许存在一个 type="selection" 的列');
      return;
    }
    _columns.value.push(column);
    if (column.type === 'selection' && column.selectable) {
      selectable.value = column.selectable;
    }
    updateColumns();
  }

  /** 移除列 */
  function removeColumn(column: TableColumnCtx<T>) {
    const index = _columns.value.indexOf(column);
    if (index > -1) {
      _columns.value.splice(index, 1);
      if (column.type === 'selection') {
        selectable.value = null;
      }
      updateColumns();
    }
  }

  /** 设置数据 */
  function setData(newData: T[]) {
    _data.value = newData;
    execSort();
    if (currentRow.value && !newData.includes(currentRow.value)) {
      currentRow.value = null;
    }
    updateAllSelected();
  }

  /** 是否选中 */
  function isSelected(row: T): boolean {
    return selection.value.includes(row);
  }

  /** 切换行选中 */
  function toggleRowSelection(row: T) {
    const isSel = isSelected(row);
    if (!isSel) {
      selection.value = [...selection.value, row];
    } else {
      selection.value = selection.value.filter((r) => r !== row);
    }
    updateAllSelected();
  }

  /** 全选/取消全选 */
  function toggleAllSelection() {
    if (isAllSelected.value) {
      clearSelection();
    } else {
      selection.value = data.value.filter((row, index) => {
        if (selectable.value) {
          return selectable.value(row, index);
        }
        return true;
      });
      isAllSelected.value = true;
    }
  }

  /** 更新全选状态 */
  function updateAllSelected() {
    if (data.value.length === 0) {
      isAllSelected.value = false;
      return;
    }
    const selectableRows = data.value.filter((row, index) => {
      if (selectable.value) {
        return selectable.value(row, index);
      }
      return true;
    });
    if (selectableRows.length === 0) {
      isAllSelected.value = false;
      return;
    }
    isAllSelected.value = selectableRows.every((row) => isSelected(row));
  }

  /** 清空选择 */
  function clearSelection() {
    selection.value = [];
    isAllSelected.value = false;
  }

  /** 获取选中行 */
  function getSelectionRows(): T[] {
    return selection.value.slice();
  }

  /** 设置当前行 */
  function setCurrentRow(row: T | null) {
    const oldRow = currentRow.value;
    currentRow.value = row;
    return { currentRow, oldCurrentRow: oldRow };
  }

  /** 更新排序 */
  function updateSort(column: TableColumnCtx<T> | null, name: string | null, order: TableSortOrder | null) {
    if (sortingColumn.value && sortingColumn.value !== column) {
      sortingColumn.value.order = null;
    }
    if (column) {
      column.order = order;
    }
    sortingColumn.value = column;
    sortName.value = name;
    sortOrder.value = order;
  }

  /** 执行排序 */
  function execSort() {
    const sort = sortingColumn.value?.sort;
    const sortMethod = isFunction(sort) ? sort : null;
    data.value = orderBy(
      _data.value,
      sortName.value,
      sortOrder.value,
      sortMethod,
    );
  }

  /** 清除排序 */
  function clearSort() {
    if (!sortingColumn.value) return;
    updateSort(null, null, null);
    execSort();
  }

  /** 解析宽度 */
  function parseWidth(width: number | undefined): number | undefined {
    if (width === undefined) return undefined;
    return width;
  }

  /** 排序数据 */
  function orderBy(
    data: T[],
    sortKey: string | null,
    reverse: TableSortOrder | null,
    sortMethod: ((a: T, b: T) => number) | null,
  ): T[] {
    if (!sortKey && !sortMethod) {
      return data;
    }
    const reverseNum = reverse === 'descending' ? -1 : 1;

    const getKey = sortMethod
      ? null
      : function (value: T) {
          if (sortKey && typeof value === 'object') {
            return get(value, sortKey);
          }
          return value;
        };

    return [...data].sort((a, b) => {
      if (sortMethod) {
        return sortMethod(a, b) * reverseNum;
      }
      const keyA = getKey!(a);
      const keyB = getKey!(b);
      if (keyA === keyB) return 0;
      if (keyA === null || keyA === undefined) return 1;
      if (keyB === null || keyB === undefined) return -1;
      return (keyA > keyB ? 1 : -1) * reverseNum;
    });
  }

  return {
    states: {
      _columns,
      columns,
      _data,
      data,
      isAllSelected,
      selection,
      currentRow,
      sortingColumn,
      sortName,
      sortOrder,
      selectable,
      bodyWidth,
      scrollX,
    },
    parseWidth,
    insertColumn,
    removeColumn,
    updateColumns,
    updateColumnsWidth,
    setData,
    isSelected,
    toggleRowSelection,
    toggleAllSelection,
    updateAllSelected,
    clearSelection,
    getSelectionRows,
    setCurrentRow,
    updateSort,
    execSort,
    clearSort,
  };
}

/** Store 类型 */
export type TableStore<T extends DefaultRow = DefaultRow> = ReturnType<typeof useTableStore<T>>;
