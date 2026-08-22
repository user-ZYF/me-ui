<!-- ? Scrollbar 滚动条组件 -->
<template>
  <div :class="ns.b.value">
    <div
      ref="wrapRef"
      :class="[ns.e('wrap'), 'is-scrollbar-hidden']"
      :style="wrapStyle"
      @scroll="onScroll"
    >
      <div
        ref="viewRef"
        :class="ns.e('view')"
      >
        <slot></slot>
      </div>
    </div>

      <Bar
        v-if="sizeHeight"
        :vertical="true"
        :size="sizeHeight"
        :move="moveY"
        @scroll="onVerticalScroll"
      />
      <Bar
        v-if="sizeWidth"
        :vertical="false"
        :size="sizeWidth"
        :move="moveX"
        @scroll="onHorizontalScroll"
      />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

import { useResizeObserver } from '@vueuse/core';
import debounce from 'lodash/debounce';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { scrollbarEmits, scrollbarProps } from './scrollbar';
import Bar from './Bar.vue';

defineOptions({ name: 'MeScrollbar' });

const props = defineProps(scrollbarProps);
const emit = defineEmits(scrollbarEmits);

const ns = useNamespace('scrollbar');

/** wrap 容器引用 */
const wrapRef = ref<HTMLDivElement>();
/** view 容器引用 */
const viewRef = ref<HTMLElement>();

/** 水平滚动滑块移动百分比 */
const moveX = ref(0);
/** 垂直滚动滑块移动百分比 */
const moveY = ref(0);
/** 水平滚动滑块宽度百分比 */
const sizeWidth = ref('');
/** 垂直滚动滑块高度百分比 */
const sizeHeight = ref('');

/** 滑块最小尺寸百分比 */
const MIN_THUMB_SIZE = 20;

/** 防抖更新 */
const debouncedUpdate = debounce(() => nextTick(update), 50);

/** 使用 VueUse 监听内容尺寸变化 */
useResizeObserver(viewRef, debouncedUpdate);

/** wrap 容器样式 */
const wrapStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  }
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
  }
  return style;
});

/** 更新滚动条滑块尺寸和位置 */
function update() {
  const wrap = wrapRef.value;
  if (!wrap) return;

  const offsetHeight = wrap.offsetHeight;
  const offsetWidth = wrap.offsetWidth;
  const scrollHeight = wrap.scrollHeight;
  const scrollWidth = wrap.scrollWidth;

  // 计算垂直滚动条滑块高度百分比
  const heightRatio = offsetHeight / scrollHeight;
  const thumbHeight = Math.max(heightRatio * 100, MIN_THUMB_SIZE);
  sizeHeight.value = thumbHeight < 100 ? `${thumbHeight}%` : '';

  // 计算水平滚动条滑块宽度百分比
  const widthRatio = offsetWidth / scrollWidth;
  const thumbWidth = Math.max(widthRatio * 100, MIN_THUMB_SIZE);
  sizeWidth.value = thumbWidth < 100 ? `${thumbWidth}%` : '';
}

/** 更新滑块移动位置 */
function setScrollPosition() {
  const wrap = wrapRef.value;
  if (!wrap) return;

  // 解析滑块实际尺寸百分比（考虑最小尺寸生效的情况）
  const vSize = parseFloat(sizeHeight.value) || 0;
  const hSize = parseFloat(sizeWidth.value) || 0;

  // 滚动进度（0 ~ 1）
  const vProgress = wrap.scrollHeight - wrap.clientHeight > 0
    ? wrap.scrollTop / (wrap.scrollHeight - wrap.clientHeight)
    : 0;
  const hProgress = wrap.scrollWidth - wrap.clientWidth > 0
    ? wrap.scrollLeft / (wrap.scrollWidth - wrap.clientWidth)
    : 0;

  // top/left 的百分比是相对于滚动条（父容器）的高度/宽度：
  // move = scrollProgress * (滚动条高度 - 滑块高度) / 滚动条高度 * 100
  //      = scrollProgress * (100 - sizePercent)
  moveY.value = vSize > 0 ? vProgress * (100 - vSize) : 0;
  moveX.value = hSize > 0 ? hProgress * (100 - hSize) : 0;
}

/** 滚动事件处理 */
function onScroll() {
  setScrollPosition();
  if (wrapRef.value) {
    emit('scroll', wrapRef.value.scrollTop, wrapRef.value.scrollLeft);
  }
}

/** 垂直滚动条拖拽处理 */
function onVerticalScroll(scrollPercentage: number) {
  const wrap = wrapRef.value;
  if (!wrap) return;
  // scrollPercentage 是滚动进度（0 ~ 100），直接转换为 scrollTop
  setScrollTop((scrollPercentage / 100) * (wrap.scrollHeight - wrap.clientHeight));
}

/** 水平滚动条拖拽处理 */
function onHorizontalScroll(scrollPercentage: number) {
  const wrap = wrapRef.value;
  if (!wrap) return;
  setScrollLeft((scrollPercentage / 100) * (wrap.scrollWidth - wrap.clientWidth));
}

/** 设置滚动位置到顶部 */
function setScrollTop(value: number) {
  if (wrapRef.value) {
    wrapRef.value.scrollTop = value;
  }
}

/** 设置滚动位置到左侧 */
function setScrollLeft(value: number) {
  if (wrapRef.value) {
    wrapRef.value.scrollLeft = value;
  }
}

onBeforeUnmount(() => {
  debouncedUpdate.cancel();
});

onMounted(() => {
  nextTick(() => {
    update();
    setScrollPosition();
  });
});

defineExpose({
  /** wrap 容器引用 */
  wrapRef,
  /** 更新滚动条状态 */
  update,
  /** 设置滚动位置到顶部 */
  setScrollTop,
  /** 设置滚动位置到左侧 */
  setScrollLeft,
  /** 手动触发滚动事件 */
  onScroll,
});
</script>
