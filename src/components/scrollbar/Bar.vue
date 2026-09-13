<!-- Bar 滚动条组件 -->
<template>
  <div
    ref="trackRef"
    :class="[ns.e('bar'), ns.is('horizontal', !vertical), ns.is('dragging', isDragging)]"
    @mousedown="onTrackClick"
  >
    <div
      ref="thumbRef"
      :class="ns.e('thumb')"
      :style="thumbStyle"
      @mousedown.prevent.stop="onThumbMouseDown"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { barProps } from './scrollbar';

defineOptions({ name: 'MeBar' });

const props = defineProps(barProps);

const emit = defineEmits<{
  (e: 'scroll', offset: number): void;
}>();

const ns = useNamespace('scrollbar');

/** 滚动条元素引用 */
const trackRef = ref<HTMLDivElement>();
/** 滑块元素引用 */
const thumbRef = ref<HTMLDivElement>();

/** 滑块样式 */
const thumbStyle = computed(() => {
  const sizeKey = props.vertical ? 'height' : 'width';
  const posKey = props.vertical ? 'top' : 'left';
  return {
    [sizeKey]: props.size,
    [posKey]: `${props.move}%`,
  } as Record<string, string>;
});

/** 拖拽状态 */
let cursorDown = false;
/** 是否正在拖拽 */
const isDragging = ref(false);
/** 鼠标按下时点击点在滑块内的偏移量 */
let thumbClickOffset = 0;

/** 鼠标移动事件处理函数引用 */
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
/** 鼠标抬起事件处理函数引用 */
let mouseUpHandler: (() => void) | null = null;

/** 鼠标按下滑块开始拖拽 */
function onThumbMouseDown(e: MouseEvent) {
  if (e.ctrlKey || e.button === 2) return;

  cursorDown = true;
  isDragging.value = true;

  // 记录点击点在滑块内的偏移量（距离滑块顶部的像素距离）
  const thumb = e.currentTarget as HTMLElement;
  const thumbRect = thumb.getBoundingClientRect();
  const thumbStart = props.vertical ? thumbRect.top : thumbRect.left;
  const mousePos = props.vertical ? e.clientY : e.clientX;
  thumbClickOffset = mousePos - thumbStart;

  // 绑定全局事件
  mouseMoveHandler = onMouseMove;
  mouseUpHandler = onMouseUp;
  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  // 拖拽时禁用文本选择
  document.body.style.userSelect = 'none';
}

/** 鼠标移动时计算滑块顶部位置百分比 */
function onMouseMove(e: MouseEvent) {
  if (!cursorDown || !trackRef.value || !thumbRef.value) return;

  const trackRect = trackRef.value.getBoundingClientRect();
  const trackStart = props.vertical ? trackRect.top : trackRect.left;
  const trackSize = props.vertical ? trackRef.value.clientHeight : trackRef.value.clientWidth;
  const thumbSize = props.vertical ? thumbRef.value.clientHeight : thumbRef.value.clientWidth;
  const mousePos = props.vertical ? e.clientY : e.clientX;

  // 滑块顶部相对于滚动条顶部的像素偏移，限制在 0 ~ 滚动条尺寸-滑块尺寸 范围内
  const maxThumbTop = trackSize - thumbSize;
  const thumbTopPixels = Math.max(0, Math.min(mousePos - trackStart - thumbClickOffset, maxThumbTop));
  // 转换为滚动进度百分比（0 ~ 100）
  const scrollPercentage = maxThumbTop > 0 ? (thumbTopPixels * 100) / maxThumbTop : 0;
  emit('scroll', scrollPercentage);
}

/** 鼠标抬起结束拖拽 */
function onMouseUp() {
  cursorDown = false;
  isDragging.value = false;
  thumbClickOffset = 0;
  document.body.style.userSelect = '';

  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
  if (mouseUpHandler) {
    window.removeEventListener('mouseup', mouseUpHandler);
    mouseUpHandler = null;
  }
}

/** 点击滚动条区域，滑块跳转到点击位置 */
function onTrackClick(e: MouseEvent) {
  if (!trackRef.value || !thumbRef.value) return;

  const trackRect = trackRef.value.getBoundingClientRect();
  const trackStart = props.vertical ? trackRect.top : trackRect.left;
  const trackSize = props.vertical ? trackRef.value.clientHeight : trackRef.value.clientWidth;
  const thumbSize = props.vertical ? thumbRef.value.clientHeight : thumbRef.value.clientWidth;
  const mousePos = props.vertical ? e.clientY : e.clientX;

  // 点击位置相对于滚动条的偏移
  const clickOffset = mousePos - trackStart;

  // 滑块顶部位置 = 点击位置 - 滑块一半，使滑块居中于点击点，限制在合法范围内
  const maxThumbTop = trackSize - thumbSize;
  const thumbTopPixels = Math.max(0, Math.min(clickOffset - thumbSize / 2, maxThumbTop));
  // 转换为滚动进度百分比（0 ~ 100）
  const scrollPercentage = maxThumbTop > 0 ? (thumbTopPixels * 100) / maxThumbTop : 0;
  emit('scroll', scrollPercentage);
}

onBeforeUnmount(() => {
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
  }
  if (mouseUpHandler) {
    window.removeEventListener('mouseup', mouseUpHandler);
  }
  document.body.style.userSelect = '';
});
</script>
