import type { ExtractPropTypes } from 'vue';

/** Pager Props 定义 */
export const paginationPagerProps = {
  /** 当前页码 */
  currentPage: {
    type: Number,
    default: 1,
  },
  /** 总页数 */
  pageCount: {
    type: Number,
    required: true,
  },
  /** 页码按钮数量 */
  pagerCount: {
    type: Number,
    default: 7,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

/** Pager Props 类型 */
export type PaginationPagerProps = ExtractPropTypes<typeof paginationPagerProps>;
