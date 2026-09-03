import type { InjectionKey, Ref } from 'vue';

import type { DefaultRow, TableSortOrder, TableColumnCtx } from './types';
import type { TableContext } from './table';

/** Table 命名空间 */
export const TABLE_NAMESPACE = 'table';

/** Table 注入 key */
export const TABLE_INJECTION_KEY: InjectionKey<TableContext> = Symbol('MeTable');

/** TableColumn 注入 key（用于多级表头父子关系） */
export const TABLE_COLUMN_INJECTION_KEY: InjectionKey<Ref<TableColumnCtx<DefaultRow> | undefined>> = Symbol('MeTableColumn');

/** 列默认最小宽度 */
export const DEFAULT_MIN_COLUMN_WIDTH = 80;

/** 排序顺序循环 */
export const SORT_ORDERS: (TableSortOrder | null)[] = ['ascending', 'descending', null];

/** Table ID 种子 */
let tableIdSeed = 1;

/** 生成 Table ID */
export function createTableId(namespace: string): string {
  return `${namespace}-table_${tableIdSeed++}`;
}

/** 列 ID 种子 */
let columnIdSeed = 1;

/** 生成列 ID */
export function createColumnId(parentId: string): string {
  return `${parentId}_column_${columnIdSeed++}`;
}
