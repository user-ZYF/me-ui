import { ref, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';

import { useRafThrottle } from '@me-ui/hooks/use-raf-throttle';
import type { ItemKey } from '../types';

/** 高度缓存 */
export type HeightCache = Map<any, number>;

/** 高度变化信息 */
export interface HeightChange {
  /** 项目索引 */
  index: number;
  /** 项目 key */
  key: any;
  /** 旧高度 */
  oldHeight: number;
  /** 新高度 */
  newHeight: number;
  /** 变更项的顶部偏移量（基于变更前的高度） */
  prevItemTop: number;
}

/** 高度收集返回值 */
export interface HeightCollection<T> {
  /** 设置项 DOM 实例 */
  setItemRef: (item: T, el: HTMLElement | null) => void;
  /** 收集所有项的实际高度 */
  collectHeight: (sync?: boolean) => void;
  /** 高度缓存 */
  heights: HeightCache;
  /** 获取项高度，未缓存时回退到 itemHeight */
  getItemHeight: (key: any) => number;
  /** 判断项高度是否已缓存 */
  isHeightCached: (key: any) => boolean;
  /** 更新标记（变化时触发重新计算） */
  heightUpdateMark: Ref<symbol>;
  /** 确保前缀和数组已构建（若脏则重建），仅在高度变化时执行 O(n) */
  ensurePrefixSums: () => void;
  /** 获取指定索引项的顶部偏移量 O(1) */
  getItemTop: (index: number) => number;
  /** 获取指定索引项的底部偏移量 O(1) */
  getItemBottom: (index: number) => number;
  /** 二分查找：给定垂直偏移量，返回该偏移量所在项的索引 O(log n) */
  findIndexAtOffset: (offset: number) => number;
  /** 列表总高度 O(1) */
  getTotalHeight: () => number;
}

/**
 * 收集并缓存每个列表项的实际高度
 * @param data 数据源
 * @param getItemKey 获取项 key 的函数
 */
export function useItemHeights<T>(
  data: ComputedRef<any[]>,
  getItemKey: ItemKey<T>,
  itemHeight: number,
  onResize: (changes: HeightChange[]) => void,
): HeightCollection<T> {
  /** DOM 实例缓存 */
  const itemRefs = new Map<any, HTMLElement>();
  /** 高度缓存 */
  const heights = new Map<any, number>();
  /** key → index 映射 */
  const keyToIndex = new Map<any, number>();
  /** 更新标记 */
  const heightUpdateMark = ref(Symbol('height-update'));
  /** index → key 数组，用于前缀和重建时避免函数调用 */
  let keysArray: any[] = [];
  /** 前缀和数组：prefixSums[i] = 项 0..i 的高度总和，prefixSums[n-1] = 总高度 */
  let prefixSums: number[] = [];
  /** 前缀和是否脏（需要重建） */
  let prefixSumsDirty = true;

  watch(
    data,
    () => {
      // 清理不再存在的高度缓存和 DOM 引用，避免 key 复用时使用过期缓存
      const currentKeys = new Set<any>();
      keyToIndex.clear();
      keysArray = new Array(data.value.length);
      for (let i = 0; i < data.value.length; i++) {
        const key = getItemKey(data.value[i]);
        keysArray[i] = key;
        currentKeys.add(key);
        keyToIndex.set(key, i);
      }
      /** 删除过期的高度缓存 */
      for (const key of heights.keys()) {
        if (!currentKeys.has(key)) {
          heights.delete(key);
        }
      }
      /** 删除过期的 DOM 引用 */
      for (const key of itemRefs.keys()) {
        if (!currentKeys.has(key)) {
          itemRefs.delete(key);
        }
      }
      heightUpdateMark.value = Symbol('height-update');
      prefixSumsDirty = true;
    },
    { immediate: true },
  );

  /** itemHeight 变化时，未缓存项的回退高度改变，前缀和需重建 */
  watch(
    () => itemHeight,
    () => {
      prefixSumsDirty = true;
      heightUpdateMark.value = Symbol('height-update');
    },
  );

  /** 重建前缀和数组 O(n) */
  function rebuildPrefixSums() {
    const n = data.value.length;
    if (n === 0) {
      prefixSums = [];
      prefixSumsDirty = false;
      return;
    }
    if (prefixSums.length !== n) {
      prefixSums = new Array(n);
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += getItemHeight(keysArray[i]);
      prefixSums[i] = sum;
    }
    prefixSumsDirty = false;
  }

  /** 确保前缀和数组已构建 */
  function ensurePrefixSums() {
    if (prefixSumsDirty) {
      rebuildPrefixSums();
    }
  }

  /** 遍历 DOM 实例，收集实际高度 */
  function doCollectHeight() {
    // 批量收集高度变化，避免逐项回调导致 O(n²)
    const changes: HeightChange[] = [];
    /** 待应用的高度更新 */
    const updates: Array<{ key: any; height: number }> = [];
    itemRefs.forEach((el, key) => {
      if (el && el.isConnected) {
        const { offsetHeight } = el;
        const prevHeight = heights.get(key);
        // TODO: 增加 dirty 标记，仅在 item 挂载/卸载时标记为脏，避免无变化时遍历所有可见 DOM 读取 offsetHeight 导致重排
        if (prevHeight !== offsetHeight) {
          const index = keyToIndex.get(key);
          if (index !== undefined) {
            changes.push({
              index,
              key,
              oldHeight: prevHeight ?? itemHeight,
              newHeight: offsetHeight,
              prevItemTop: 0,
            });
          }
          updates.push({ key, height: offsetHeight });
        }
      }
    });
    if (changes.length > 0) {
      // 先确保前缀和反映变更前的高度状态
      ensurePrefixSums();
      // 使用前缀和 O(1) 获取变更项的顶部位置，传给 onResize
      for (const change of changes) {
        change.prevItemTop = getItemTop(change.index);
      }
      onResize(changes);
      // 再应用高度更新到缓存
      for (const { key, height } of updates) {
        heights.set(key, height);
      }
      heightUpdateMark.value = Symbol('height-update');
      prefixSumsDirty = true;
    }
  }

  /** rAF 节流版本，用于异步收集 */
  const { throttled: throttledCollectHeight, cancel: cancelThrottled } =
    useRafThrottle(doCollectHeight);

  /** 收集实际高度 */
  function collectHeight(sync = false) {
    if (sync) {
      /** 同步模式：立即收集，用于平滑滚动期间避免 rAF 延迟导致闪烁 */
      cancelThrottled();
      doCollectHeight();
      return;
    }
    /** 异步模式：rAF 节流收集，用于常规场景 */
    throttledCollectHeight();
  }

  /** 设置/移除项 DOM 实例 */
  function setItemRef(item: T, el: HTMLElement | null) {
    const key = getItemKey(item);
    if (key === undefined || key === null) {
      console.warn(
        '[MeVirtualList] itemKey 解析结果为空，请检查 itemKey 配置是否正确',
        item,
      );
      return;
    }
    if (el) {
      itemRefs.set(key, el);
      collectHeight();
    } else {
      itemRefs.delete(key);
    }
  }

  /** 获取项高度，未缓存时回退到 itemHeight */
  function getItemHeight(key: any): number {
    return heights.get(key) ?? itemHeight;
  }

  /** 判断项高度是否已缓存 */
  function isHeightCached(key: any): boolean {
    return heights.has(key);
  }

  /** 获取指定索引项的顶部偏移量 O(1) */
  function getItemTop(index: number): number {
    ensurePrefixSums();
    const n = data.value.length;
    if (index <= 0 || n === 0) return 0;
    if (index >= n) return prefixSums[n - 1];
    return prefixSums[index - 1];
  }

  /** 获取指定索引项的底部偏移量 O(1) */
  function getItemBottom(index: number): number {
    ensurePrefixSums();
    const n = data.value.length;
    if (index < 0 || n === 0) return 0;
    if (index >= n) return prefixSums[n - 1];
    return prefixSums[index];
  }

  /** 二分查找：返回包含指定偏移量的项的索引 O(log n) */
  function findIndexAtOffset(offset: number): number {
    ensurePrefixSums();
    const n = data.value.length;
    if (n === 0) return 0;
    if (offset <= 0) return 0;
    let left = 0;
    let right = n - 1;
    while (left <= right) {
      const mid = (left + right) >> 1;
      const bottom = prefixSums[mid];
      if (bottom < offset) {
        left = mid + 1;
      } else if (bottom > offset) {
        right = mid - 1;
      } else {
        return Math.min(mid + 1, n - 1);
      }
    }
    return Math.min(left, n - 1);
  }

  /** 列表总高度 O(1) */
  function getTotalHeight(): number {
    ensurePrefixSums();
    const n = data.value.length;
    return n === 0 ? 0 : prefixSums[n - 1];
  }

  return {
    setItemRef,
    collectHeight,
    heights,
    getItemHeight,
    isHeightCached,
    heightUpdateMark,
    ensurePrefixSums,
    getItemTop,
    getItemBottom,
    findIndexAtOffset,
    getTotalHeight,
  };
}
