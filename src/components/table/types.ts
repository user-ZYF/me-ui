import type { VNode } from 'vue';

import type { TableStore } from './store';

/** 默认行数据类型 */
export type DefaultRow = Record<string, any>;

/** 排序方向 */
export type TableSortOrder = 'ascending' | 'descending';

/** 列类型 */
export type TableColumnType = 'selection' | 'default';

/** 固定列方向 */
export type TableColumnFixed = 'left' | 'right';

/** 对齐方式 */
export type TableColumnAlign = 'left' | 'center' | 'right';

/** 单元格渲染数据 */
export interface TableCellData<T extends DefaultRow = DefaultRow> {
  /** 行数据 */
  row: T;
  /** 列配置 */
  column: TableColumnCtx<T>;
  /** 行索引 */
  rowIndex: number;
}

/** 表头渲染数据 */
export interface TableHeaderData<T extends DefaultRow = DefaultRow> {
  /** 列配置 */
  column: TableColumnCtx<T>;
  /** 列索引 */
  columnIndex: number;
}

/** 单元格渲染数据 */
export interface TableCellRenderData<T extends DefaultRow = DefaultRow> extends TableCellData<T> {
  /** Store 实例 */
  store: TableStore<T>;
}

/** 表头渲染数据 */
export interface TableHeaderRenderData<T extends DefaultRow = DefaultRow> extends TableHeaderData<T> {
  /** Store 实例 */
  store: TableStore<T>;
}

/** 单元格合并跨度信息 */
export interface SpanInfo {
  /** 跨行数 */
  rowspan: number;
  /** 跨列数 */
  colspan: number;
}

/** 列上下文对象 */
export interface TableColumnCtx<T extends DefaultRow = DefaultRow> {
  /** 列 ID */
  id: string;
  /** 列类型 */
  type: TableColumnType;
  /** 列标签 */
  label: string;
  /** 列属性名 */
  name: string;
  /** 列宽度 */
  width?: number;
  /** 列最小宽度 */
  minWidth: number;
  /** 实际渲染宽度 */
  realWidth: number | null;
  /** 对齐方式 */
  align: TableColumnAlign;
  /** 表头对齐方式 */
  headerAlign: TableColumnAlign;
  /** 排序配置（true 开启默认排序，函数为自定义排序） */
  sort: boolean | ((a: T, b: T) => number);
  /** 排序顺序 */
  order: TableSortOrder | null;
  /** 格式化函数 */
  formatter?: (row: T, column: TableColumnCtx<T>, cellValue: any, rowIndex: number) => string | VNode | VNode[];
  /** 是否可选（仅 type=selection） */
  selectable?: (row: T, rowIndex: number) => boolean;
  /** 渲染表头 */
  renderHeader: (data: TableHeaderRenderData<T>) => string | VNode | VNode[];
  /** 渲染单元格 */
  renderCell: (data: TableCellRenderData<T>) => string | VNode | VNode[];
  /** 固定列方向 */
  fixed?: TableColumnFixed;
  /** 子列（用于多级表头） */
  children?: TableColumnCtx<T>[];
  /** 层级 */
  level: number;
  /** 列跨度 */
  colSpan: number;
  /** 行跨度 */
  rowSpan: number;
  /** 是否为分组列 */
  isColumnGroup: boolean;
  /** 是否为子列 */
  isSubColumn: boolean;
}
