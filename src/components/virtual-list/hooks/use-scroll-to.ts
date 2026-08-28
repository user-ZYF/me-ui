import type { ComputedRef, Ref } from 'vue';
import { onBeforeUnmount } from 'vue';
import { easeOutQuint } from 'js-easing-functions';

import type { MeScrollbar } from '@me-ui/components/scrollbar';
import { isScrollToIndex, isScrollToKey } from '../types';
import type { ItemKey, ScrollAlign, ScrollConfig, ScrollTo } from '../types';

/** 目标项位置计算结果 */
export interface ItemPosition {
  /** 目标项顶部位置（px） */
  itemTop: number;
  /** 目标项底部位置（px） */
  itemBottom: number;
  /** 目标项高度是否未缓存 */
  hasUncachedHeight: boolean;
}

/** scrollTo 参数 */
export interface ScrollToOptions {
  /** MeScrollbar 组件实例引用 */
  containerRef: Ref<InstanceType<typeof MeScrollbar> | undefined>;
  /** 数据源 */
  data: ComputedRef<any[]>;
  /** 获取项高度，未缓存时回退到 itemHeight */
  getItemHeight: (key: any) => number;
  /** 判断项高度是否已缓存 */
  isHeightCached: (key: any) => boolean;
  /** 获取项 key 的函数 */
  getItemKey: ItemKey<any>;
  /** 收集高度函数 */
  collectHeight: (sync?: boolean) => void;
  /** 设置滚动位置函数（同步更新 DOM 和组件状态） */
  setScrollTop: (top: number) => void;
}

/**
 * 创建 scrollTo 函数，支持滚动到指定索引或 key
 */
export function useScrollTo(options: ScrollToOptions): ScrollTo {
  const { containerRef, data, getItemHeight, isHeightCached, getItemKey, collectHeight, setScrollTop } = options;

  let rafId: number | undefined;
  /** 平滑滚动动画 ID */
  let smoothRafId: number | undefined;

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (smoothRafId) cancelAnimationFrame(smoothRafId);
  });

  /** 获取实际 DOM 容器 */
  function getContainer(): HTMLElement | undefined {
    return containerRef.value?.wrapRef;
  }

  /** 计算目标项的顶部和底部位置（基于当前高度缓存） */
  function getItemPosition(items: any[], index: number): ItemPosition {
    let itemTop = 0;
    let itemBottom = 0;
    let hasUncachedHeight = false;

    const maxLen = Math.min(items.length, index);
    for (let i = 0; i <= maxLen; i += 1) {
      const key = getItemKey(items[i]);
      itemTop = itemBottom;
      itemBottom = itemTop + getItemHeight(key);

      if (i === index && !isHeightCached(key)) {
        hasUncachedHeight = true;
      }
    }

    return { itemTop, itemBottom, hasUncachedHeight };
  }

  /** 计算目标滚动位置（基于当前高度缓存） */
  function calculateTargetTop(items: any[], index: number, align: ScrollAlign | undefined, offset: number): number {
    const container = getContainer();
    if (!container) return 0;

    const containerHeight = container.clientHeight;
    const { itemTop, itemBottom } = getItemPosition(items, index);

    const scrollTop = container.scrollTop;
    const scrollBottom = scrollTop + containerHeight;

    switch (align) {
      case 'top':
        return itemTop - offset;
      case 'bottom':
        return itemBottom - containerHeight - offset;
      default: 
        if (itemTop < scrollTop) {
          return itemTop - offset;
        }
        if (itemBottom > scrollBottom) {
          return itemBottom - containerHeight - offset;
        }
        return scrollTop;
    }
  }

  /** 普通模式：多帧修正滚动位置 */
  function syncScroll(
    items: any[],
    index: number,
    align: ScrollAlign | undefined,
    offset: number,
    times: number,
    targetAlign?: ScrollAlign,
  ) {
    const container = getContainer();
    if (times < 0 || !container) return;

    const containerHeight = container.clientHeight;
    let needCollectHeight = false;
    /** 下一帧使用的对齐方式，用于在 auto 模式下锁定方向，避免多帧修正时反复跳变 */
    let nextAlign = targetAlign;

    if (containerHeight) {
      const mergedAlign = targetAlign || align;

      const { itemTop, itemBottom, hasUncachedHeight } = getItemPosition(items, index);
      if (hasUncachedHeight) {
        needCollectHeight = true;
      }

      const scrollTop = container.scrollTop;
      let targetTop: number | null = null;

      switch (mergedAlign) {
        case 'top':
          targetTop = itemTop - offset;
          break;
        case 'bottom':
          targetTop = itemBottom - containerHeight - offset;
          break;
        default: {
          /** auto 模式：目标项不在可视区域内时，根据位置确定对齐方向并锁定到 nextAlign */
          const scrollBottom = scrollTop + containerHeight;
          if (itemTop < scrollTop) {
            nextAlign = 'top';
          } else if (itemBottom > scrollBottom) {
            nextAlign = 'bottom';
          }
        }
      }

      if (targetTop !== null && targetTop !== scrollTop) {
        setScrollTop(targetTop);
      }
    }

    rafId = requestAnimationFrame(() => {
      if (needCollectHeight) {
        collectHeight();
      }
      syncScroll(items, index, align, offset, times - 1, nextAlign);
    });
  }

  /** 平滑滚动：rAF 手动动画，使用 js-easing-functions 缓动函数 */
  function smoothScrollTo(
    items: any[],
    index: number,
    align: ScrollAlign | undefined,
    offset: number,
    duration: number,
  ) {
    const container = getContainer();
    if (!container) return;

    if (smoothRafId) cancelAnimationFrame(smoothRafId);

    const startTop = container.scrollTop;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;

      /** 每帧同步收集高度并重新计算目标位置 */
      collectHeight(true);
      const currentTarget = calculateTargetTop(items, index, align, offset);

      /** 使用 js-easing-functions 计算缓动位置 */
      const currentTop = easeOutQuint(elapsed, startTop, currentTarget - startTop, duration);

      /** 设置 DOM scrollTop 并同步给组件状态 */
      setScrollTop(currentTop);

      if (elapsed < duration) {
        smoothRafId = requestAnimationFrame(animate);
      } else {
        /** （处理微小误差）动画结束后收集高度并修正最终位置 */
        const correctScroll = (times: number) => {
          if (times <= 0) return;
          smoothRafId = requestAnimationFrame(() => {
            /** 组件可能已卸载，检查容器是否存在 */
            if (!getContainer()) return;
            collectHeight(true);
            const finalTarget = calculateTargetTop(items, index, align, offset);
            setScrollTop(finalTarget);
            correctScroll(times - 1);
          });
        };
        correctScroll(3);
      }
    }

    smoothRafId = requestAnimationFrame(animate);
  }

  return (arg?: number | ScrollConfig) => {
    if (arg === null || arg === undefined) {
      return;
    }

    if (rafId) cancelAnimationFrame(rafId);
    if (smoothRafId) cancelAnimationFrame(smoothRafId);

    const items = data.value;

    if (typeof arg === 'number') {
      setScrollTop(arg);
      return;
    }

    if (arg && typeof arg === 'object') {
      if (items.length === 0) return;

      /** itemHeight 为 0 时（非虚拟模式），高度全部依赖缓存，需同步收集 */
      const firstKey = getItemKey(items[0]);
      if (!isHeightCached(firstKey) && !getItemHeight(firstKey)) {
        collectHeight(true);
      }

      let index: number;
      const { align, behavior = 'auto' } = arg;

      if (isScrollToIndex(arg)) {
        index = arg.index;
      } else if (isScrollToKey(arg)) {
        index = items.findIndex((item: any) => getItemKey(item) === arg.key);
      } else {
        return;
      }

      /** 越界或未找到目标项时给出警告并退出 */
      if (index < 0 || index >= items.length) {
        console.warn('[MeVirtualList] scrollTo 目标索引越界或 key 未找到，已忽略', arg);
        return;
      }

      const { offset = 0 } = arg;
      const isSmooth = behavior === 'smooth';

      /** 平滑模式：直接启动 rAF 动画，每帧动态计算目标 */
      if (isSmooth) {
        smoothScrollTo(items, index, align, offset, 300);
        return;
      }

      /** 普通模式：多帧修正 */
      syncScroll(items, index, align, offset, 5);
    }
  };
}
