<!-- ? Tooltip 内容组件，负责弹出层的渲染和过渡动画 -->
<template>
  <teleport to="body">
    <transition :name="transitionName" @after-leave="onAfterLeave" @before-enter="onBeforeEnter" @after-enter="onAfterEnter" @before-leave="onBeforeLeave">
      <div v-show="shouldShow" ref="popperRef" :class="contentClass" :style="popperStyle" role="tooltip" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <slot></slot>
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
import { ARROW_SIZE } from './use-popper';
import type { TooltipPlacement } from './tooltip';
import { isTriggerType } from './utils';

defineOptions({ name: 'MeTooltipContent', inheritAttrs: false });

const props = defineProps({
  /** 位置信息 */
  position: {
    type: Object as PropType<{ left: number; top: number; arrowLeft: number; arrowTop: number; placement: TooltipPlacement }>,
    required: true,
  },
});

const ns = useNamespace('tooltip');

const { controlled, open, trigger, effect, zIndex, popperClass, onOpen, onClose, onShow, onHide, onBeforeShow, onBeforeHide } = inject(TOOLTIP_INJECTION_KEY)!;

/** 弹出层元素引用 */
const popperRef = ref<HTMLElement>();

/** 是否应该显示 */
const shouldShow = computed(() => open.value);

/** 过渡动画名称 */
const transitionName = computed(() => `${ns.namespace}-tooltip-fade`);

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
}));

/** 箭头样式（主轴 + 副轴均由 JS 计算） */
const arrowStyle = computed<CSSProperties>(() => {
  const placement = props.position.placement;
  const offset = `${-ARROW_SIZE / 2}px`;
  if (placement.startsWith('top')) {
    return { left: `${props.position.arrowLeft}px`, bottom: offset };
  }
  if (placement.startsWith('bottom')) {
    return { left: `${props.position.arrowLeft}px`, top: offset };
  }
  if (placement.startsWith('left')) {
    return { top: `${props.position.arrowTop}px`, right: offset };
  }
  return { top: `${props.position.arrowTop}px`, left: offset };
});

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

defineExpose({
  /** 弹出层元素引用 */
  popperRef,
});
</script>
