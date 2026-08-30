import type { ExtractPropTypes } from 'vue';

/** Prev Props 定义 */
export const paginationPrevProps = {
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 当前页码 */
  currentPage: {
    type: Number,
    default: 1,
  },
  /** 上一页按钮文字 */
  prevText: {
    type: String,
    default: '',
  },
} as const;

/** Prev Props 类型 */
export type PaginationPrevProps = ExtractPropTypes<typeof paginationPrevProps>;
