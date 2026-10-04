import type { EmitFn, ExtractPropTypes, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

import type { DefaultRow, SpanInfo, TableColumnCtx } from './types';
import type { TableStore } from './store';

export type { DefaultRow, SpanInfo, TableColumnCtx, TableSortOrder } from './types';

/** Table Props 定义 */
export const tableProps = {
  /** 表格数据 */
  data: {
    type: Array as PropType<DefaultRow[]>,
    default: () => [],
  },
  /** 表格尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
  /** 表格高度 */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  /** 表格最大高度 */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
  /** 合并行/列计算函数 */
  spanMethod: {
    type: Function as PropType<(data: { row: DefaultRow; rowIndex: number; column: TableColumnCtx<DefaultRow>; columnIndex: number }) => SpanInfo>,
    default: undefined,
  },
} as const;

/** Table Props 类型 */
export type TableProps = ExtractPropTypes<typeof tableProps>;

/** Table Emits 定义 */
export const tableEmits = {
  /** 选择行 */
  select: (_selection: DefaultRow[], _row: DefaultRow) => true,
  /** 全选 */
  'select-all': (_selection: DefaultRow[]) => true,
  /** 选择变化 */
  'selection-change': (_selection: DefaultRow[]) => true,
  /** 表体单元格点击 */
  'body-cell-click': (_row: DefaultRow, _column: TableColumnCtx<DefaultRow>, _event: PointerEvent) => true,
  /** 表头单元格点击 */
  'header-cell-click': (_column: TableColumnCtx<DefaultRow>, _event: PointerEvent) => true,
  /** 排序变化 */
  'sort-change': (_column: TableColumnCtx<DefaultRow>) => true,
  /** 当前行变化 */
  'current-change': (_currentRow: DefaultRow | null, _oldCurrentRow: DefaultRow | null) => true,
} as const;

/** Table Emits 类型 */
export type TableEmits = typeof tableEmits;

/** Table 上下文（提供给子组件注入） */
export interface TableContext {
  /** Table ID（方便调试） */
  tableId: string;
  /** Store 实例 */
  store: TableStore;
  /** Table props */
  props: TableProps;
  /** emit 函数 */
  emit: EmitFn<TableEmits>;
}
