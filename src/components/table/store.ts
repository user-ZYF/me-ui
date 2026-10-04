import { ref } from 'vue';

import type { Ref } from 'vue';
import type { DefaultRow, TableColumnCtx, TableSortOrder } from './types';

import { get } from 'lodash';

import { isFunction, isNil, isObject } from '@me-ui/utils/types';

/** 表格 Store 状态管理 */
export function useTableStore<T extends DefaultRow = DefaultRow>() {

  /** 原始列定义（树形结构） */
  const _columns: Ref<TableColumnCtx<T>[]> = ref([]);
  /** 按fixed状态排序过的列（树形结构，用于表头渲染） */
  const columns: Ref<TableColumnCtx<T>[]> = ref([]);
  /** 展平后的叶子列（用于表体渲染） */
  const leafColumns: Ref<TableColumnCtx<T>[]> = ref([]);
  /** 原始数据 */
  const _data: Ref<T[]> = ref([]);
  /** 当前展示数据（经过排序） */
  const data: Ref<T[]> = ref([]);
  /** 是否全选 */
  const isAllSelected = ref(false);
  /** 选中的行 */
  const selection: Ref<T[]> = ref([]);
  /** 当前高亮行 */
  const curHighlightRow: Ref<T | null> = ref(null);
  /** 排序列 */
  const sortingColumn: Ref<TableColumnCtx<T> | null> = ref(null);
  /** selectable 函数 */
  const selectableFn: Ref<TableColumnCtx<T>['selectableFn'] | null> = ref(null);
  /** 表体宽度（px） */
  const tableBodyWidth: Ref<number> = ref(0);
  /** 是否有横向滚动 */
  const hasScrollX: Ref<boolean> = ref(false);

  /** 校验单个列配置，校验成功返回 true，失败返回 false 并输出 warn */
  function validateColumn(column: TableColumnCtx<T>, parent?: TableColumnCtx<T>): boolean {
    if (parent && column.fixed) {
      console.warn('[MeTable] fixed 只能设置在一级列上，子列设置无效');
    }
    if (parent && column.type === 'selection') {
      console.warn('[MeTable] type="selection" 的列只能作为一级叶子列');
      return false;
    }
    if (column.type === 'selection' && leafColumns.value.some((col) => col.type === 'selection')) {
      console.warn('[MeTable] 只允许存在一个 type="selection" 的列');
      return false;
    }
    if (column.children && column.children.length > 0) {
      if (column.type === 'selection') {
        console.warn('[MeTable] type="selection" 的列不能包含子列，请将其设置为一级叶子列');
        return false;
      }
      if (column.sort) {
        console.warn('[MeTable] sort 仅对叶子列有效');
      }
    }
    return true;
  }

  /** 更新列（按固定状态排序：左固定 → 非固定 → 右固定，保留树形结构） */
  function updateColumns() {
    // 只有最外层table-column设置的fixed才有效
    _columns.value.forEach((column) => {
      updateChildFixed(column);
    });

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
    leafColumns.value = flattenColumns(columns.value);
  }

  /** 计算列宽度 */
  function updateColumnsWidth(containerWidth: number) {
    const cols = leafColumns.value;
    if (cols.length === 0) return;

    /** 没有 width 的弹性列 */
    const flexColumns = cols.filter((col) => col.width === undefined);

    let bodyMinWidth = 0;

    if (flexColumns.length > 0) {
      // 计算所有列的最小宽度总和
      cols.forEach((col) => {
        bodyMinWidth += col.width ?? col.minWidth;
      });

      if (bodyMinWidth <= containerWidth) {
        // 不需要横向滚动，弹性列分配掉剩余空间
        hasScrollX.value = false;
        const totalFlexWidth = containerWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          // 只有一个弹性列，剩余空间全部分给它
          flexColumns[0].realWidth = flexColumns[0].minWidth + totalFlexWidth;
        } else {
          // 多个弹性列，按 minWidth 比例分配剩余空间
          const allFlexMinWidth = flexColumns.reduce((prev, col) => prev + col.minWidth, 0);
          // 每单位 minWidth 能分到的剩余像素数（minWidth 越大的列分到的剩余空间越多）
          const flexWidthPerPixel = totalFlexWidth / allFlexMinWidth;
          const lastIndex = flexColumns.length - 1;
          // 已分配的弹性宽度
          let allocatedFlexWidth = 0;

          flexColumns.forEach((col, index) => {
            if (index === lastIndex) return;
            const width = Math.floor(col.minWidth * flexWidthPerPixel);
            allocatedFlexWidth += width;
            col.realWidth = col.minWidth + width;
          });

          // 最后一列拿走剩余的全部空间，吸收小数误差保证总宽度精确
          const lastColumn = flexColumns[lastIndex];
          lastColumn.realWidth = lastColumn.minWidth + totalFlexWidth - allocatedFlexWidth;
        }
      } else {
        // 需要横向滚动，弹性列使用 minWidth
        hasScrollX.value = true;
        flexColumns.forEach((col) => {
          col.realWidth = col.minWidth;
        });
      }

      tableBodyWidth.value = Math.max(bodyMinWidth, containerWidth);
    } else {
      // 所有列都有显式 width，直接使用 width
      cols.forEach((col) => {
        col.realWidth = col.width!;
        bodyMinWidth += col.realWidth;
      });
      hasScrollX.value = bodyMinWidth > containerWidth;
      tableBodyWidth.value = bodyMinWidth;
    }
  }

  /** 插入列 */
  function insertColumn(column: TableColumnCtx<T>, parent?: TableColumnCtx<T>) {
    if (!validateColumn(column, parent)) return;

    if (!parent) {
      _columns.value.push(column);
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(column);
      // 整体替换，方便外部触发浅层响应式
      _columns.value = replaceColumn(_columns.value, parent);
    }

    if (column.type === 'selection' && column.selectableFn) {
      selectableFn.value = column.selectableFn;
    }
    updateColumns();
  }

  /** 移除列 */
  function removeColumn(column: TableColumnCtx<T>, parent?: TableColumnCtx<T>) {
    let removed = false;

    if (parent) {
      if (parent.children) {
        const childIndex = parent.children.findIndex((item) => item.id === column.id);
        if (childIndex !== -1) {
          parent.children.splice(childIndex, 1);
          removed = true;
        }
        if (parent.children.length === 0) {
          delete parent.children;
        }
      }
      _columns.value = replaceColumn(_columns.value, parent);
    } else {
      const index = _columns.value.indexOf(column);
      if (index > -1) {
        _columns.value.splice(index, 1);
        removed = true;
      }
    }

    if (removed && column.type === 'selection') {
      selectableFn.value = null;
    }
    // 被移除的列（或其子列）正在排序时，清除排序状态
    if (removed && sortingColumn.value && getAllColumns([column]).includes(sortingColumn.value)) {
      updateSort(null, null);
    }
    updateColumns();
  }

  /** 设置数据 */
  function setData(newData: T[]) {
    _data.value = newData;
    data.value = orderBy(newData, sortingColumn.value);
    if (curHighlightRow.value && !newData.includes(curHighlightRow.value)) {
      curHighlightRow.value = null;
    }
    updateAllSelected();
  }

  /** 切换行选中 */
  function toggleRowSelection(row: T) {
    const isSel = selection.value.includes(row);
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
        if (selectableFn.value) {
          return selectableFn.value(row, index);
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
      if (selectableFn.value) {
        return selectableFn.value(row, index);
      }
      return true;
    });
    if (selectableRows.length === 0) {
      isAllSelected.value = false;
      return;
    }
    isAllSelected.value = selectableRows.every((row) => selection.value.includes(row));
  }

  /** 清空选择 */
  function clearSelection() {
    selection.value = [];
    isAllSelected.value = false;
  }

  /** 设置当前行 */
  function setCurrentRow(row: T | null) {
    const oldRow = curHighlightRow.value;
    curHighlightRow.value = row;
    return oldRow;
  }

  /** 更新排序 */
  function updateSort(column: TableColumnCtx<T> | null, order: TableSortOrder | null) {
    if (sortingColumn.value && sortingColumn.value !== column) {
      sortingColumn.value.order = null;
    }
    if (column) {
      column.order = order;
    }
    sortingColumn.value = column;
    data.value = orderBy(_data.value, column);
  }

  /** 清除排序 */
  function clearSort() {
    if (!sortingColumn.value) return;
    updateSort(null, null);
  }

  /** 排序数据 */
  function orderBy(
    data: T[],
    column: TableColumnCtx<T> | null,
  ): T[] {
    const sortKey = column?.name ?? null;
    const sort = column?.sort;
    const sortMethod = isFunction(sort) ? sort : null;
    // order 为 null 时取消排序，直接返回原始数据
    if (!column?.order || (!sortKey && !sortMethod)) {
      return data;
    }
    const reverseNum = column.order === 'descending' ? -1 : 1;

    function getKey(value: T) {
      if (sortKey && isObject(value)) {
        return get(value, sortKey);
      }
      return value;
    }

    return [...data].sort((a, b) => {
      if (sortMethod) {
        return sortMethod(a, b) * reverseNum;
      }
      const keyA = getKey(a);
      const keyB = getKey(b);
      if (keyA === keyB) return 0;
      if (isNil(keyA)) return 1;
      if (isNil(keyB)) return -1;
      return (keyA > keyB ? 1 : -1) * reverseNum;
    });
  }

  /** 递归展平列树，只保留叶子列（用于表体渲染） */
  function flattenColumns(columns: TableColumnCtx<T>[]): TableColumnCtx<T>[] {
    const result: TableColumnCtx<T>[] = [];
    columns.forEach((column) => {
      if (column.children && column.children.length > 0) {
        result.push(...flattenColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  }

  /** 递归获取单个列子树中的所有叶子列 */
  function getLeafColumns(column: TableColumnCtx<T>): TableColumnCtx<T>[] {
    if (!column.children || column.children.length === 0) {
      return [column];
    }
    const result: TableColumnCtx<T>[] = [];
    column.children.forEach((child) => {
      result.push(...getLeafColumns(child));
    });
    return result;
  }

  /** 收集所有列（包括子列） */
  function getAllColumns(cols: TableColumnCtx<T>[]): TableColumnCtx<T>[] {
    const result: TableColumnCtx<T>[] = [];
    cols.forEach((column) => {
      result.push(column);
      if (column.children) {
        result.push(...getAllColumns(column.children));
      }
    });
    return result;
  }

  /** 在列树中替换指定列（用于更新父列的 children） */
  function replaceColumn(columns: TableColumnCtx<T>[], column: TableColumnCtx<T>): TableColumnCtx<T>[] {
    return columns.map((item) => {
      if (item.id === column.id) {
        return column;
      }
      if (item.children?.length) {
        item.children = replaceColumn(item.children, column);
      }
      return item;
    });
  }

  /** 递归将父列的 fixed 属性传递给子列 */
  function updateChildFixed(column: TableColumnCtx<T>) {
    column.children?.forEach((childColumn) => {
      childColumn.fixed = column.fixed;
      updateChildFixed(childColumn);
    });
  }

  return {
    columns,
    leafColumns,
    data,
    isAllSelected,
    selection,
    curHighlightRow,
    tableBodyWidth,
    hasScrollX,
    insertColumn,
    removeColumn,
    updateColumnsWidth,
    setData,
    toggleRowSelection,
    toggleAllSelection,
    clearSelection,
    setCurrentRow,
    updateSort,
    clearSort,
    getLeafColumns,
    getAllColumns,
  };
}

/** Store 类型 */
export type TableStore<T extends DefaultRow = DefaultRow> = ReturnType<typeof useTableStore<T>>;
