import type { InjectionKey, Ref } from 'vue';

import type { Arrayable, TooltipPlacement, TooltipTriggerType } from './tooltip';

/** Tooltip 注入上下文类型 */
export interface TooltipContext {
  /** 是否受控 */
  controlled: Ref<boolean>;
  /** 是否打开 */
  open: Ref<boolean>;
  /** 是否禁用 */
  disabled: Ref<boolean>;
  /** 触发方式 */
  trigger: Ref<Arrayable<TooltipTriggerType>>;
  /** 出现位置 */
  placement: Ref<TooltipPlacement>;
  /** z-index */
  zIndex: Ref<number>;
  /** 打开 */
  onOpen: (e?: Event) => void;
  /** 关闭 */
  onClose: (e?: Event) => void;
  /** 切换 */
  onToggle: (e: Event) => void;
  /** 显示前回调 */
  onBeforeShow: () => void;
  /** 隐藏前回调 */
  onBeforeHide: () => void;
  /** 已显示回调 */
  onShow: () => void;
  /** 已隐藏回调 */
  onHide: () => void;
  /** 更新弹出层位置 */
  updatePopper: () => void;
}

/** Tooltip 注入 key */
export const TOOLTIP_INJECTION_KEY: InjectionKey<TooltipContext> = Symbol('meTooltip');
