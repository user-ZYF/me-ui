import type { ExtractPropTypes, PropType } from 'vue';

import type { ItemKey } from './types';

/** VirtualList Props 定义 */
export const virtualListProps = {
  /** 数据源 */
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  /** 容器高度，传入后启用虚拟滚动 */
  height: {
    type: Number,
    default: undefined,
  },
  /** 每项预估高度，用于初始渲染前计算可见区间，实际高度由 DOM 测量后动态修正 */
  itemHeight: {
    type: Number,
    default: undefined,
  },
  /** 是否启用虚拟滚动，默认开启 */
  virtual: {
    type: Boolean,
    default: true,
  },
  /** 获取项 key 的字段名或函数，用于高度缓存和列表项复用 */
  itemKey: {
    type: [String, Number, Function] as PropType<string | number | ItemKey>,
    required: true as const,
  },
  /** 视口外额外渲染的项数，缓解快速滚动时的空白 */
  overscan: {
    type: Number,
    default: 5,
    validator: (val: number) => val >= 0,
  },
} as const;

/** VirtualList Props 类型 */
export type VirtualListProps = ExtractPropTypes<typeof virtualListProps>;

/** VirtualList Emits 定义 */
export const virtualListEmits = {
  /** 滚动事件 */
  scroll: (_scrollTop: number) => true,
} as const;

/** VirtualList Emits 类型 */
export type VirtualListEmits = typeof virtualListEmits;
