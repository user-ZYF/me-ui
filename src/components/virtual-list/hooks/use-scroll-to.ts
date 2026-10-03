import type { ComputedRef, Ref } from 'vue';
import { onBeforeUnmount } from 'vue';
import { easeOutQuint } from 'js-easing-functions';

import type { MeScrollbar } from '@me-ui/components/scrollbar';
import { isNumber } from '@me-ui/utils/types';
import { isScrollToIndex, isScrollToKey } from '../types';
import type { ItemKey, ScrollAlign, ScrollConfig, ScrollTo } from '../types';

/** 目标项位置计算结果 */
export interface ItemPosition {
  /** 目标项顶部位置（px） */
  itemTop: number;
  /** 目标项底部位置（px） */
  itemBottom: number;
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
  /** 获取指定索引项的顶部偏移量 O(1) */
  getItemTop: (index: number) => number;
  /** 获取指定索引项的底部偏移量 O(1) */
  getItemBottom: (index: number) => number;
}

/**
 * 创建 scrollTo 函数，支持滚动到指定索引或 key
 */
export function useScrollTo(options: ScrollToOptions): ScrollTo {
  const { containerRef, data, getItemHeight, isHeightCached, getItemKey, collectHeight, setScrollTop, getItemTop, getItemBottom } = options;

  /** 滚动循环的动画帧 ID */
  let rafId: number | undefined;

  /** 修正帧数上限：目标位置连续稳定则提前退出，此值仅兜底防死循环 */
  const MAX_CORRECTION_FRAMES = 10;
  /** 判定收敛所需的连续稳定帧数 */
  const STABLE_FRAMES = 2;

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  /** 获取实际 DOM 容器 */
  function getContainer(): HTMLElement | undefined {
    return containerRef.value?.wrapRef;
  }

  /** 计算目标项的顶部和底部位置（基于当前高度缓存） */
  function getItemPosition(index: number): ItemPosition {
    const itemTop = getItemTop(index);
    const itemBottom = getItemBottom(index);

    return { itemTop, itemBottom };
  }

  /** 计算目标滚动位置（基于当前高度缓存） */
  function calculateTargetTop(index: number, align: ScrollAlign | undefined, offset: number): number {
    const container = getContainer();
    if (!container) return 0;

    const containerHeight = container.clientHeight;
    const { itemTop, itemBottom } = getItemPosition(index);

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

  /**
   * 滚动循环：每帧收集高度、重新计算目标位置并设置 scrollTop
   * - 普通模式（无 duration）：每帧直接跳到目标位置，收敛后提前退出，上限 MAX_CORRECTION_FRAMES 帧
   * - 平滑模式（有 duration）：每帧按 easeOutQuint 缓动插值，动画结束后进入修正阶段（同上收敛退出）
   */
  function runScrollLoop(
    index: number,
    align: ScrollAlign | undefined,
    offset: number,
    duration?: number,
  ) {
    const container = getContainer();
    if (!container) return;

    const startTop = container.scrollTop;
    // 动画起始时间戳，与 RAF 回调参数同一时钟源，用于计算每帧的已进行时长
    const startTime = performance.now();
    // auto 模式下锁定的对齐方向（仅普通滚动），避免多帧修正时反复跳变
    let lockedAlign: ScrollAlign | undefined;
    // 剩余修正帧数；平滑滚动在动画期间不限帧数，结束后切换为修正帧数
    let remainingFrames = duration ? Number.POSITIVE_INFINITY : MAX_CORRECTION_FRAMES;
    // 上一帧的目标位置与连续稳定帧数，用于收敛判断
    let lastTargetTop = Number.NaN;
    let stableFrames = 0;

    const step = (currentTime: number) => {
      const container = getContainer();
      if (!container || remainingFrames < 0) return;

      // 已过的时间
      const elapsedTime = currentTime - startTime;

      if (container.clientHeight) {
        // 每帧同步收集高度并重新计算目标位置
        collectHeight(true);

        // 普通滚动的 auto 模式：目标项不在可视区域内时，根据位置锁定对齐方向
        if (!duration && !align) {
          const { itemTop, itemBottom } = getItemPosition(index);
          const scrollTop = container.scrollTop;
          if (itemTop < scrollTop) {
            lockedAlign = 'top';
          } else if (itemBottom > scrollTop + container.clientHeight) {
            lockedAlign = 'bottom';
          }
        }

        const targetTop = calculateTargetTop(index, lockedAlign ?? align, offset);
        // 修正阶段（普通滚动或平滑动画结束后）：目标位置连续稳定即收敛，提前退出
        const isScrolling = duration !== undefined && elapsedTime < duration;
        if (!isScrolling) {
          if (targetTop === lastTargetTop) {
            stableFrames++;
            if (stableFrames >= STABLE_FRAMES) {
              return;
            }
          } else {
            stableFrames = 0;
          }
          lastTargetTop = targetTop;
        }
        // 如果动画还未结束，则继续进行平滑滚动，否则直接滚动到目标（普通滚动直接滚动到目标）
        const top = isScrolling
          ? easeOutQuint(elapsedTime, startTop, targetTop - startTop, duration)
          : targetTop;
        if (top !== container.scrollTop) {
          setScrollTop(top);
        }
      }

      // 平滑滚动动画结束后进入修正阶段
      if (duration && elapsedTime >= duration && remainingFrames > MAX_CORRECTION_FRAMES) {
        remainingFrames = MAX_CORRECTION_FRAMES;
      }
      remainingFrames--;
      if (remainingFrames >= 0) {
        rafId = requestAnimationFrame(step);
      }
    };

    // 首帧同步执行，使普通滚动立即定位
    step(startTime);
  }

  return (arg: number | ScrollConfig) => {
    if (rafId) cancelAnimationFrame(rafId);

    const items = data.value;
    if (items.length === 0) return;

    if (isNumber(arg)) {
      setScrollTop(arg);
      return;
    }

    // itemHeight 为 0 时（非虚拟模式），高度全部依赖缓存，需同步收集
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

    // 越界或未找到目标项时给出警告并退出
    if (index < 0 || index >= items.length) {
      console.warn('[MeVirtualList] scrollTo 目标索引越界或 key 未找到，已忽略', arg);
      return;
    }

    const { offset = 0 } = arg;
    const duration = behavior === 'smooth' ? 300 : undefined;

    runScrollLoop(index, align, offset, duration);
  };
}
