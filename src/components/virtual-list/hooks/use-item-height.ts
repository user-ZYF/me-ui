import { ref, watch } from 'vue';
import type { Ref, ShallowRef } from 'vue';

import { useRafThrottle } from '@me-ui/hooks/use-raf-throttle';
import type { ItemKey } from '../types';

/** 高度缓存 */
export type HeightCache = Map<any, number>;

/** 高度收集返回值 */
export interface HeightCollection<T> {
  /** 设置项 DOM 实例 */
  setItemRef: (item: T, el: HTMLElement | null) => void;
  /** 收集所有项的实际高度 */
  collectHeight: (sync?: boolean) => void;
  /** 高度缓存 */
  heights: HeightCache;
  /** 更新标记（变化时触发重新计算） */
  heightUpdateMark: Ref<symbol>;
}

/**
 * 收集并缓存每个列表项的实际高度
 * @param data 数据源
 * @param getItemKey 获取项 key 的函数
 */
export function useItemHeights<T>(
  data: ShallowRef<any[]>,
  getItemKey: ItemKey<T>,
): HeightCollection<T> {
  /** DOM 实例缓存 */
  const itemRefs = new Map<any, HTMLElement>();
  /** 高度缓存 */
  const heights = new Map<any, number>();
  /** 更新标记 */
  const heightUpdateMark = ref(Symbol('height-update'));

  watch(data, () => {
    /** 清理不再存在的高度缓存和 DOM 引用，避免 key 复用时使用过期缓存 */
    const currentKeys = new Set<any>();
    for (const item of data.value) {
      currentKeys.add(getItemKey(item));
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
  });

  /** 遍历 DOM 实例，收集实际高度 */
  function doCollectHeight() {
    itemRefs.forEach((el, key) => {
      if (el && el.isConnected) {
        const { offsetHeight } = el;
        // TODO: 增加 dirty 标记，仅在 item 挂载/卸载时标记为脏，避免无变化时遍历所有可见 DOM 读取 offsetHeight 导致重排
        if (heights.get(key) !== offsetHeight) {
          heightUpdateMark.value = Symbol('height-update');
          heights.set(key, offsetHeight);
        }
      }
    });
  }

  /** rAF 节流版本，用于异步收集 */
  const { throttled: throttledCollectHeight, cancel: cancelThrottled } = useRafThrottle(doCollectHeight);

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
      console.warn('[MeVirtualList] itemKey 解析结果为空，请检查 itemKey 配置是否正确', item);
      return;
    }
    if (el) {
      itemRefs.set(key, el);
      collectHeight();
    } else {
      itemRefs.delete(key);
    }
  }

  return {
    setItemRef,
    collectHeight,
    heights,
    heightUpdateMark,
  };
}