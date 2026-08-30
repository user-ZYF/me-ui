import type { ExtractPropTypes, PropType } from 'vue';

/** Sizes Props 定义 */
export const paginationSizesProps = {
  /** 每页条数 */
  pageSize: {
    type: Number,
    required: true,
  },
  /** 可选的每页条数 */
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 50, 100],
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

/** Sizes Props 类型 */
export type PaginationSizesProps = ExtractPropTypes<typeof paginationSizesProps>;
