import type { ExtractPropTypes, PropType } from 'vue';

/** Scrollbar Props 定义 */
export const scrollbarProps = {
  /**
   * 滚动区域固定高度
   * - 设置后容器高度固定，内容超出时出现垂直滚动条
   * - 不设置时高度由父容器决定
   */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  /**
   * 滚动区域最大高度
   * - 内容不超过此高度时自适应撑开，超过后锁定高度并出现滚动条
   */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
} as const;

/** Scrollbar Props 类型 */
export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>;

/** Scrollbar Emits 定义 */
export const scrollbarEmits = {
  /**
   * 滚动事件
   */
  scroll: (_scrollTop: number, _scrollLeft: number) => true,
} as const;

/** Scrollbar Emits 类型 */
export type ScrollbarEmits = typeof scrollbarEmits;

/** Bar Props 定义（内部子组件，不对外暴露） */
export const barProps = {
  /** 是否为垂直方向 */
  vertical: {
    type: Boolean,
    default: false,
  },
  /** 滑块的尺寸百分比 */
  size: {
    type: String,
    default: '',
  },
  /** 滑块的移动距离百分比 */
  move: {
    type: Number,
    default: 0,
  },
} as const;

/** Bar Props 类型 */
export type BarProps = ExtractPropTypes<typeof barProps>;
