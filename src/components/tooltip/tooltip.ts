import type { ExtractPropTypes, PropType } from 'vue';

/** Tooltip 触发方式 */
export type TooltipTriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

/** 可数组化的类型 */
export type Arrayable<T> = T | T[];

/** Tooltip 出现位置 */
export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

/** Tooltip 主题效果 */
export type TooltipEffect = 'light' | 'dark';

/** Tooltip Props 定义 */
export const tooltipProps = {
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 显示内容 */
  content: {
    type: String,
    default: '',
  },
  /** 出现位置 */
  placement: {
    type: String as PropType<TooltipPlacement>,
    default: 'top',
  },
  /** 触发方式 */
  trigger: {
    type: [String, Array] as PropType<Arrayable<TooltipTriggerType>>,
    default: 'hover',
  },
  /** 主题效果 */
  effect: {
    type: String as PropType<TooltipEffect>,
    default: 'dark',
  },
  /** z-index */
  zIndex: {
    type: Number,
    default: 2000,
  },
  /** 自定义弹出层类名 */
  popperClass: {
    type: String,
    default: '',
  },
  /** hover 触发时显示延迟（毫秒） */
  showAfter: {
    type: Number,
    default: 0,
  },
  /** hover 触发时隐藏延迟（毫秒） */
  hideAfter: {
    type: Number,
    default: 0,
  },
  /** 过渡动画名称 */
  transition: {
    type: String,
    default: '',
  },
} as const;

/** Tooltip Props 类型 */
export type TooltipProps = ExtractPropTypes<typeof tooltipProps>;

/** Tooltip Emits 定义 */
export const tooltipEmits = {
  /** 显示前 */
  beforeShow: () => true,
  /** 隐藏前 */
  beforeHide: () => true,
  /** 已显示 */
  show: () => true,
  /** 已隐藏 */
  hide: () => true,
} as const;

/** Tooltip Emits 类型 */
export type TooltipEmits = typeof tooltipEmits;
