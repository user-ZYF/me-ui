<!-- ? 虚拟列表组件 -->
<template>
  <div :class="ns.b.value">
    <me-scrollbar
      ref="scrollbarRef"
      :height="height"
      @scroll="onScroll"
    >
      <!-- 填充层：撑开虚拟总高度，可见项通过 translateY 偏移 -->
      <div :style="fillerStyle">
        <div :style="contentStyle" :class="ns.e('content')">
          <template v-for="(item, index) in visibleItems" :key="getItemKey(item)">
            <div :ref="(el) => setItemRef(item, el as HTMLElement | null)">
              <slot :item="item" :index="startIndex + index"></slot>
            </div>
          </template>
        </div>
      </div>
    </me-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import type { CSSProperties } from 'vue';

import MeScrollbar from '@me-ui/components/scrollbar';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { virtualListEmits, virtualListProps } from './virtual-list';
import { useItemHeights } from './hooks/use-item-height';
import { useScrollTo } from './hooks/use-scroll-to';
import type { ItemKey, ScrollTo, VisibleRange } from './types';

defineOptions({ name: 'MeVirtualList', inheritAttrs: false });

const props = defineProps(virtualListProps);
const emit = defineEmits(virtualListEmits);

const ns = useNamespace('virtual-list');

/** MeScrollbar 引用 */
const scrollbarRef = ref<InstanceType<typeof MeScrollbar>>();

/** 是否启用虚拟滚动 */
const isVirtual = computed(() => {
  const { height, itemHeight, virtual } = props;
  return !!(virtual && height && itemHeight);
});

/** 是否真正进入虚拟模式（数据量超过容器高度） */
const isVirtualActive = computed(() => {
  const { height, itemHeight, data } = props;
  return isVirtual.value && data && itemHeight && data.length > 0 && itemHeight * data.length > (height || 0);
});

/** 当前滚动位置 */
const scrollTop = ref(0);

/** 是否处于底部 */
const isAtBottom = ref(false);

/** 数据源 */
const items = shallowRef<any[]>([]);

watch(
  () => props.data,
  () => {
    items.value = props.data ?? [];
    // 数据变化后重置滚动位置，避免旧 scrollTop 与新内容高度不匹配导致滚动条瞬移
    setScrollTop(0);
  },
  { immediate: true },
);

/** itemKey 解析函数 */
const resolveKey = shallowRef<ItemKey>((_item: Record<string, any>) => undefined as any);

watch(
  () => props.itemKey,
  (val) => {
    if (typeof val === 'function') {
      resolveKey.value = val;
    } else {
      resolveKey.value = (item: Record<string, any>) => item?.[val];
    }
  },
  { immediate: true },
);

/** 获取列表项 key */
function getItemKey(item: Record<string, any>) {
  const key = resolveKey.value(item);
  if (key === undefined || key === null || (typeof key === 'number' && Number.isNaN(key))) {
    throw new Error('[me-virtual-list] getItemKey 返回了无效值（undefined / null / NaN），请检查 itemKey 配置是否正确');
  }
  return key;
}

/** 高度收集 */
const { setItemRef, collectHeight, heights, heightUpdateMark } = useItemHeights(items, getItemKey);

/** 可见区间计算结果 */
const visibleRange = reactive<VisibleRange>({
  totalHeight: undefined,
  startIndex: 0,
  endIndex: 0,
  offset: undefined,
});

/** 非虚拟模式：渲染全部 */
watch(
  [isVirtual, items],
  () => {
    if (!isVirtual.value) {
      Object.assign(visibleRange, {
        totalHeight: undefined,
        startIndex: 0,
        endIndex: items.value.length - 1,
        offset: undefined,
      });
    }
  },
  { immediate: true },
);

/** 虚拟模式但数据量不够：渲染全部 */
watch(
  [isVirtual, items, isVirtualActive],
  () => {
    if (isVirtual.value && !isVirtualActive.value) {
      Object.assign(visibleRange, {
        totalHeight: undefined,
        startIndex: 0,
        endIndex: items.value.length - 1,
        offset: undefined,
      });
    }
  },
  { immediate: true },
);

/** 虚拟模式核心计算：根据 scrollTop 计算可见区间 */
watch(
  [isVirtualActive, isVirtual, () => scrollTop.value, items, heightUpdateMark, () => props.height],
  () => {
    if (!isVirtual.value || !isVirtualActive.value) return;

    /** 当前项的顶部位置（累加器） */
    let itemTop = 0;
    /** 可见区间起始索引 */
    let startIndex: number | undefined;
    /** 可见区间起始项的垂直偏移量 */
    let startOffset: number | undefined;
    /** 可见区间结束索引 */
    let endIndex: number | undefined;
    /** 数据总量 */
    const itemCount = items.value.length;
    /** 数据源引用 */
    const data = items.value;
    /** 可见区域顶部（当前滚动位置） */
    const visibleTop = scrollTop.value;
    /** 预估高度和容器高度 */
    const { itemHeight, height } = props;
    /** 可见区域底部（scrollTop + 容器高度） */
    const visibleBottom = visibleTop + height!;

    for (let i = 0; i < itemCount; i += 1) {
      const item = data[i];
      const key = getItemKey(item);

      let cachedHeight = heights.get(key);
      if (cachedHeight === undefined) {
        cachedHeight = itemHeight!;
      }
      const itemBottom = itemTop + cachedHeight;

      if (startIndex === undefined && itemBottom >= visibleTop) {
        startIndex = i;
        startOffset = itemTop;
      }

      if (endIndex === undefined && itemBottom > visibleBottom) {
        endIndex = i;
      }

      itemTop = itemBottom;
    }

    if (startIndex === undefined) {
      startIndex = 0;
      startOffset = 0;
      endIndex = Math.ceil(height! / itemHeight!);
    }
    if (endIndex === undefined) {
      endIndex = itemCount - 1;
    }

    endIndex = Math.min(endIndex, itemCount - 1);

    Object.assign(visibleRange, {
      totalHeight: itemTop,
      startIndex,
      endIndex,
      offset: startOffset,
    });
  },
  { immediate: true },
);

/** 滚动事件处理 */
function onScroll(top: number) {
  scrollTop.value = top;
  const wrap = scrollbarRef.value?.wrapRef;
  if (wrap) {
    /** 2px 容差，应对浏览器浮点数精度和亚像素渲染导致的误差 */
    isAtBottom.value = top + wrap.clientHeight >= wrap.scrollHeight - 2;
  }
  emit('scroll', top);
}

/** 底部修正：高度收集导致 totalHeight 变化时，若用户在底部则同步修正 scrollTop */
watch(
  () => visibleRange.totalHeight,
  (newTotal) => {
    if (!isVirtualActive.value || !isAtBottom.value || newTotal === undefined) return;
    const wrap = scrollbarRef.value?.wrapRef;
    if (!wrap) return;
    const maxScrollTop = newTotal - wrap.clientHeight;
    if (maxScrollTop <= 0) return;
    /** 差距超过 1px 才修正，避免亚像素级变化导致不必要的滚动和 watch 循环 */
    if (Math.abs(scrollTop.value - maxScrollTop) > 1) {
      setScrollTop(maxScrollTop);
    }
  },
);

/** 设置滚动位置（同步更新 DOM 和组件状态） */
function setScrollTop(top: number) {
  scrollbarRef.value?.setScrollTop(top);
  // 同步更新scrollTop ref内容，确保visibleRange尽快更新，避免列表闪烁
  const wrap = scrollbarRef.value?.wrapRef;
  // 读取DOM实际scrollTop，避免传入的top值越界
  scrollTop.value = wrap ? wrap.scrollTop : top;
}

/** scrollTo 方法 */
const scrollTo: ScrollTo = useScrollTo({
  containerRef: scrollbarRef,
  data: items,
  heights,
  itemHeight: props.itemHeight ?? 0,
  getItemKey: getItemKey,
  collectHeight,
  setScrollTop,
});

/** 起始索引 */
const startIndex = computed(() => visibleRange.startIndex);

/** 可见项 */
const visibleItems = computed(() => {
  return items.value.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
});

/** 填充层样式 */
const fillerStyle = computed<CSSProperties>(() => {
  if (visibleRange.offset === undefined) return {};
  return {
    height: `${visibleRange.totalHeight || 0}px`,
  };
});

/** 内容层样式 */
const contentStyle = computed<CSSProperties>(() => {
  if (visibleRange.offset === undefined) return {};
  return {
    transform: `translateY(${visibleRange.offset}px)`,
  };
});

defineExpose({
  /** 滚动到指定位置 */
  scrollTo,
  /** 更新滚动条状态 */
  update: () => scrollbarRef.value?.update(),
});
</script>
