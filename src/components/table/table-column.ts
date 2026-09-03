import type { ExtractPropTypes, PropType, VNode } from 'vue';

import type { DefaultRow, TableColumnAlign, TableColumnCtx, TableColumnFixed, TableColumnType } from './types';

import { DEFAULT_MIN_COLUMN_WIDTH } from './constants';

export type { TableColumnCtx } from './types';

/** TableColumn Props 定义 */
export const tableColumnProps = {
  /** 列类型 */
  type: {
    type: String as PropType<TableColumnType>,
    default: 'default',
  },
  /** 列标签 */
  label: {
    type: String,
    default: '',
  },
  /** 列属性名 */
  name: {
    type: String,
    default: '',
  },
  /** 列宽度 */
  width: {
    type: Number as PropType<number | undefined>,
    default: undefined,
  },
  /** 列最小宽度 */
  minWidth: {
    type: Number,
    default: DEFAULT_MIN_COLUMN_WIDTH,
  },
  /** 对齐方式 */
  align: {
    type: String as PropType<TableColumnAlign>,
    default: 'left',
  },
  /** 表头对齐方式 */
  headerAlign: {
    type: String as PropType<TableColumnAlign>,
    default: undefined,
  },
  /** 排序配置（true 开启默认排序，传入函数则使用自定义排序） */
  sort: {
    type: [Boolean, Function] as PropType<boolean | TableColumnCtx<DefaultRow>['sort']>,
    default: false,
  },
  /** 格式化函数 */
  formatter: {
    type: Function as PropType<TableColumnCtx<DefaultRow>['formatter']>,
    default: undefined,
  },
  /** 是否可选（仅 type=selection） */
  selectable: {
    type: Function as PropType<TableColumnCtx<DefaultRow>['selectable']>,
    default: undefined,
  },
  /** 固定列方向 */
  fixed: {
    type: String as PropType<TableColumnFixed>,
    default: undefined,
  },
} as const;

/** TableColumn Props 类型 */
export type TableColumnProps = ExtractPropTypes<typeof tableColumnProps>;

/** TableColumn Slots 类型 */
export interface TableColumnSlots {
  /** 默认插槽（用于嵌套子列，实现多级表头） */
  default(): VNode[];
  /** 表体插槽 */
  body(props: { row: DefaultRow; column: TableColumnCtx<DefaultRow>; rowIndex: number }): VNode[];
  /** 表头插槽 */
  header(props: { column: TableColumnCtx<DefaultRow>; columnIndex: number }): VNode[];
}

/** TableColumn Emits 定义 */
export const tableColumnEmits = {} as const;

/** TableColumn Emits 类型 */
export type TableColumnEmits = typeof tableColumnEmits;
