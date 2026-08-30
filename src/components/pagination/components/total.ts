import type { ExtractPropTypes } from 'vue';

/** Total Props 定义 */
export const paginationTotalProps = {
  /** 总条目数 */
  total: {
    type: Number,
    default: 0,
  },
} as const;

/** Total Props 类型 */
export type PaginationTotalProps = ExtractPropTypes<typeof paginationTotalProps>;
