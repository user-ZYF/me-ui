import { getCurrentInstance, ref, unref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';

import type { MaybeRef, Ref } from 'vue';

import { isFunction } from '@me-ui/utils/types';

/** useFocusController 配置项 */
interface UseFocusControllerOptions {
  /** 是否禁用 */
  disabled?: MaybeRef<boolean>;
  /** 返回 true 取消聚焦 */
  beforeFocus?: (event: FocusEvent) => boolean | undefined;
  /** 聚焦后回调 */
  afterFocus?: () => void;
  /** 返回 true 取消失焦 */
  beforeBlur?: (event: FocusEvent) => boolean | undefined;
  /** 失焦后回调 */
  afterBlur?: () => void;
}

/**
 * 焦点控制器：包裹目标元素（如 input），管理 wrapper 的 focus/blur 状态
 * 通过 capture 模式监听 wrapper 上的 focus/blur 事件，实现失焦关闭弹层等场景
 */
export function useFocusController<T extends { focus: () => void }>(
  target: Ref<T | undefined>,
  wrapperRef: Ref<HTMLElement | undefined>,
  {
    disabled,
    beforeFocus,
    afterFocus,
    beforeBlur,
    afterBlur,
  }: UseFocusControllerOptions = {},
) {
  const instance = getCurrentInstance()!;
  const { emit } = instance;
  /** 是否聚焦 */
  const isFocused = ref(false);

  /** 处理聚焦 */
  function handleFocus(event: FocusEvent) {
    const cancelFocus = isFunction(beforeFocus) ? beforeFocus(event) : false;
    if (unref(disabled) || isFocused.value || cancelFocus) return;

    isFocused.value = true;
    emit('focus', event);
    afterFocus?.();
  }

  /** 处理失焦 */
  function handleBlur(event: FocusEvent) {
    const cancelBlur = isFunction(beforeBlur) ? beforeBlur(event) : false;
    if (
      unref(disabled) ||
      (event.relatedTarget &&
        wrapperRef.value?.contains(event.relatedTarget as Node)) ||
      cancelBlur
    )
      return;

    isFocused.value = false;
    emit('blur', event);
    afterBlur?.();
  }

  /** 处理点击：点击 wrapper 非可聚焦区域时，聚焦目标元素 */
  function handleClick(event: Event) {
    const el = event.target as HTMLElement;
    if (
      unref(disabled) ||
      isFocusable(el) ||
      (wrapperRef.value?.contains(document.activeElement) &&
        wrapperRef.value !== document.activeElement)
    )
      return;

    target.value?.focus();
  }

  /** 判断元素是否可聚焦 */
  function isFocusable(el: HTMLElement): boolean {
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
  }

  /** 监听 disabled 变化，设置/移除 tabindex */
  watch([wrapperRef, () => unref(disabled)], ([el, isDisabled]) => {
    if (!el) return;
    if (isDisabled) {
      el.removeAttribute('tabindex');
    } else {
      el.setAttribute('tabindex', '-1');
    }
  });

  useEventListener(wrapperRef, 'focus', handleFocus, true);
  useEventListener(wrapperRef, 'blur', handleBlur, true);
  useEventListener(wrapperRef, 'click', handleClick, true);

  return {
    /** 是否聚焦 */
    isFocused,
    /** 处理聚焦 */
    handleFocus,
    /** 处理失焦 */
    handleBlur,
  };
}
