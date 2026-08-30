import type { ExtractPropTypes, PropType } from 'vue';

/** Pagination 布局元素类型 */
export type PaginationLayoutKey = 'sizes' | 'prev' | 'pager' | 'next' | 'jumper' | '->' | 'total';

/** Pagination 布局组件类型（排除 '->' 分隔符） */
export type PaginationLayoutComponentKey = Exclude<PaginationLayoutKey, '->'>;

/** Pagination Props 定义 */
export const paginationProps = {
  /** 可选的每页条数 */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100],
  },
  /** 总条目数 */
  total: {
    type: Number,
    default: 0,
  },
  /** 总页数（设置后 total 不生效） */
  pageCount: {
    type: Number,
    default: undefined,
  },
  /** 页码按钮的数量，当总页数超过该值时会折叠（必须为奇数） */
  pagerCount: {
    type: Number,
    default: 7,
    validator: (val: number) => val >= 5 && val % 2 === 1,
  },
  /** 组件布局，子组件名用逗号分隔 */
  layout: {
    type: String as PropType<string>,
    default: 'sizes, prev, pager, next, jumper, ->, total',
  },
  /** 上一页按钮文字 */
  prevText: {
    type: String,
    default: '',
  },
  /** 下一页按钮文字 */
  nextText: {
    type: String,
    default: '',
  },
  /** 是否为带背景色的分页 */
  background: {
    type: Boolean,
    default: false,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 只有一页时是否隐藏 */
  hideOnSinglePage: {
    type: Boolean,
    default: false,
  },
} as const;

/** Pagination Props 类型 */
export type PaginationProps = ExtractPropTypes<typeof paginationProps>;

/** Pagination Emits 定义 */
export const paginationEmits = {
  /** 当前页变化 */
  'current-change': (val: number) => typeof val === 'number',
  /** 每页条数变化 */
  'size-change': (val: number) => typeof val === 'number',
  /** 上一页点击 */
  'prev-click': (val: number) => typeof val === 'number',
  /** 下一页点击 */
  'next-click': (val: number) => typeof val === 'number',
} as const;

/** Pagination Emits 类型 */
export type PaginationEmits = typeof paginationEmits;
