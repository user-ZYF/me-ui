<!-- Tooltip 内容组件 -->
<template>
  <teleport to="body">
    <transition :name="transitionName" @after-leave="onAfterLeave" @before-enter="onBeforeEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
      <div v-show="open" ref="popperRef" :class="contentClass" :style="popperStyle" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <!-- 内容 -->
        <slot></slot>
        <!-- 三角箭头 -->
        <span :class="ns.e('arrow')" :style="arrowStyle"></span>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import type { CSSProperties, PropType } from 'vue';

import { computed, inject, ref } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { TOOLTIP_INJECTION_KEY } from './constants';
import { isTriggerType } from './utils';
import { ARROW_SIZE, type PopperPosition } from './hooks/use-popper';

defineOptions({ name: 'MeTooltipContent', inheritAttrs: false });

const props = defineProps({
  /** 位置信息 */
  position: {
    type: Object as PropType<PopperPosition>,
    required: true,
  },
});

const ns = useNamespace('tooltip');

const { controlled, open, trigger, effect, zIndex, popperClass, transition, onOpen, onClose, onShow, onHide, onBeforeShow, onBeforeHide } = inject(TOOLTIP_INJECTION_KEY)!;

/** 弹出层元素引用 */
const popperRef = ref<HTMLElement>();

/** 过渡动画名称 */
const transitionName = computed(() => transition.value || `${ns.namespace}-tooltip-fade`);

/** 弹出层类名 */
const contentClass = computed(() => [
  ns.b.value,
  ns.m(props.position.placement),
  ns.m(effect.value),
  popperClass.value,
]);

/** 弹出层样式 */
const popperStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  left: `${props.position.left}px`,
  top: `${props.position.top}px`,
  zIndex: zIndex.value,
  // transform-origin 跟随实际 placement，保证缩放类过渡从正确方向展开
  transformOrigin: props.position.placement.startsWith('top') ? 'center bottom' : 'center top',
}));

/** 箭头样式（尺寸与位置均由 JS 统一计算） */
const arrowStyle = computed<CSSProperties>(() => ({
  width: `${ARROW_SIZE}px`,
  height: `${ARROW_SIZE}px`,
  left: `${props.position.arrowLeft}px`,
  top: `${props.position.arrowTop}px`,
}));

/** 受控时跳过 */
function stopWhenControlled() {
  if (controlled.value) return true;
}

/** 鼠标进入弹出层时，取消隐藏延迟 */
function onMouseEnter() {
  if (stopWhenControlled()) return;
  if (isTriggerType(trigger.value, 'hover')) {
    onOpen();
  }
}

/** 鼠标离开弹出层时，若触发方式为 hover 则关闭 */
function onMouseLeave() {
  if (stopWhenControlled()) return;
  if (isTriggerType(trigger.value, 'hover')) {
    onClose();
  }
}

/** 过渡动画开始前，通知显示前回调 */
function onBeforeEnter() {
  onBeforeShow();
}

/** 过渡动画开始前，通知隐藏前回调 */
function onBeforeLeave() {
  onBeforeHide();
}

/** 过渡动画结束后，通知已显示回调 */
function onAfterEnter() {
  onShow();
}

/** 过渡动画结束后，通知已隐藏回调 */
function onAfterLeave() {
  onHide();
}

/** 判断焦点是否在弹出层内部 */
function isFocusInsideContent(event?: FocusEvent) {
  const activeElement = (event?.relatedTarget as Node) || document.activeElement;
  return popperRef.value?.contains(activeElement);
}

defineExpose({
  /** 弹出层元素引用 */
  popperRef,
  /** 判断焦点是否在弹出层内部 */
  isFocusInsideContent,
});
</script>
