<!-- ? 虚拟列表组件 -->
<template>
  <div :class="ns.b.value">
    <me-scrollbar ref="scrollbarRef" :height="height" @scroll="onScroll">
      <!-- 填充层：撑开虚拟总高度，可见项通过 translateY 偏移 -->
      <div :style="fillerStyle">
        <div :style="contentStyle" :class="ns.e('content')">
          <template
            v-for="(item, index) in visibleItems"
            :key="getItemKey(item)"
          >
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
import { computed, reactive, ref, shallowRef, watch } from "vue";
import type { CSSProperties } from "vue";

import MeScrollbar from "@me-ui/components/scrollbar";
import { useNamespace } from "@me-ui/hooks/use-namespace";
import { isFunction } from "@me-ui/utils/types";

import { virtualListEmits, virtualListProps } from "./virtual-list";
import { useItemHeights } from "./hooks/use-item-height";
import type { HeightChange } from "./hooks/use-item-height";
import { useScrollTo } from "./hooks/use-scroll-to";
import type { ItemKey, ScrollTo, VisibleRange } from "./types";

defineOptions({ name: "MeVirtualList", inheritAttrs: false });

const props = defineProps(virtualListProps);
const emit = defineEmits(virtualListEmits);

const ns = useNamespace("virtual-list");

/** MeScrollbar 引用 */
const scrollbarRef = ref<InstanceType<typeof MeScrollbar>>();

/** 是否启用虚拟滚动（需要容器高度和预估项高度） */
const isVirtual = computed(() => {
  const { height, itemHeight } = props;
  return !!(height && itemHeight);
});

/** 是否真正进入虚拟模式（数据量超过容器高度） */
const isVirtualActive = computed(() => {
  const { height, itemHeight, data } = props;
  return (
    isVirtual.value &&
    data &&
    itemHeight &&
    data.length > 0 &&
    itemHeight * data.length > (height || 0)
  );
});

/** 当前滚动位置 */
const scrollTop = ref(0);

/** 是否处于底部 */
const isAtBottom = ref(false);

/** 数据源 */
const items = computed(() => props.data);

/** itemKey 解析函数 */
const resolveKey = shallowRef<ItemKey>(
  (_item) => undefined,
);

watch(
  () => props.itemKey,
  (val) => {
    if (isFunction(val)) {
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
  if (
    key === undefined ||
    key === null ||
    (typeof key === "number" && Number.isNaN(key))
  ) {
    throw new Error(
      "[me-virtual-list] getItemKey 返回了无效值（undefined / null / NaN），请检查 itemKey 配置是否正确",
    );
  }
  return key;
}

/** 是否正在执行补偿，用于过滤补偿引起的假滚动事件 */
let isCompensating = false;

/** 待消费的 jump 值（上方项目高度差累积，用于补偿 scrollTop） */
let pendingJump = 0;

/** 高度变化时批量计算 jump：只对顶部在可视区域上方的项目累积高度差 */
function onResize(changes: HeightChange[]) {
  for (const change of changes) {
    if (change.prevItemTop < scrollTop.value) {
      pendingJump += change.newHeight - change.oldHeight;
    }
  }
}

/** 高度收集 */
const {
  setItemRef,
  collectHeight,
  getItemHeight,
  isHeightCached,
  heightUpdateMark,
  getItemTop,
  getItemBottom,
  findIndexAtOffset,
  getTotalHeight,
} = useItemHeights(
  items,
  getItemKey,
  computed(() => props.itemHeight),
  onResize,
);

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
  [
    isVirtualActive,
    isVirtual,
    scrollTop,
    items,
    heightUpdateMark,
    () => props.height,
    () => props.overscan,
  ],
  () => {
    if (!isVirtual.value || !isVirtualActive.value) return;

    /** 数据总量 */
    const itemCount = items.value.length;
    /** 可见区域顶部（当前滚动位置） */
    const visibleTop = scrollTop.value;
    /** 预估高度和容器高度 */
    const { height, overscan } = props;
    /** 可见区域底部（scrollTop + 容器高度） */
    const visibleBottom = visibleTop + height!;

    // O(log n) 二分查找可见区间
    const rawStartIndex = findIndexAtOffset(visibleTop);
    const rawEndIndex = findIndexAtOffset(visibleBottom);

    // 添加 overscan 缓冲区
    const startIndex = Math.max(0, rawStartIndex - overscan);
    const endIndex = Math.min(itemCount - 1, rawEndIndex + overscan);
    /** 起始偏移量 O(1) */
    const startOffset = getItemTop(startIndex);
    /** 列表总高度 O(1) */
    const totalHeight = getTotalHeight();

    // 消费pendingJump，补偿scrollTop，避免跳变
    if (pendingJump !== 0) {
      isCompensating = true;
      setScrollTop(scrollTop.value + pendingJump);
      pendingJump = 0;
    }

    Object.assign(visibleRange, {
      totalHeight,
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
  // 补偿引起的假滚动，不向外部抛出事件，也不更新 isAtBottom（此时 DOM scrollHeight 尚未更新）
  if (isCompensating) {
    isCompensating = false;
    return;
  }
  const wrap = scrollbarRef.value?.wrapRef;
  if (wrap) {
    // 2px 容差，应对浏览器浮点数精度和亚像素渲染导致的误差
    isAtBottom.value = top + wrap.clientHeight >= wrap.scrollHeight - 2;
  }
  emit("scroll", top);
}

/** 底部修正：高度收集导致 totalHeight 变化时，若用户在底部则同步修正 scrollTop */
watch(
  () => visibleRange.totalHeight,
  (newTotal) => {
    if (!isVirtualActive.value || !isAtBottom.value || newTotal === undefined)
      return;
    const wrap = scrollbarRef.value?.wrapRef;
    if (!wrap) return;
    const maxScrollTop = newTotal - wrap.clientHeight;
    if (maxScrollTop <= 0) return;
    /** 差距超过 1px 才修正，避免亚像素级变化导致不必要的滚动和 watch 循环 */
    if (Math.abs(scrollTop.value - maxScrollTop) > 1) {
      isCompensating = true;
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
  // 兜底：如果 DOM 未触发 scroll 事件（值被裁剪或无变化），手动重置补偿标记
  if (isCompensating) {
    isCompensating = false;
  }
}

/** scrollTo 方法 */
const scrollTo: ScrollTo = useScrollTo({
  containerRef: scrollbarRef,
  data: items,
  getItemHeight,
  isHeightCached,
  getItemKey,
  collectHeight,
  setScrollTop,
  getItemTop,
  getItemBottom,
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
