import type { ExtractPropTypes } from 'vue';

/** Next Props 定义 */
export const paginationNextProps = {
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
  /** 总页数 */
  pageCount: {
    type: Number,
    required: true,
  },
  /** 下一页按钮文字 */
  nextText: {
    type: String,
    default: '',
  },
} as const;

/** Next Props 类型 */
export type PaginationNextProps = ExtractPropTypes<typeof paginationNextProps>;
