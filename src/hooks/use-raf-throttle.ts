import { onBeforeUnmount } from 'vue';

/**
 * rAF 节流函数工厂
 *
 * 将回调函数包装为 rAF 节流版本：同一帧内多次调用只会执行最后一次，
 * 回调在下一帧渲染前执行，适合视觉相关的更新操作
 *
 * @param fn 需要节流的回调函数
 * @returns 包含节流函数和取消函数的对象
 */
export function useRafThrottle<T extends (...args: any[]) => any>(fn: T) {
  /** rAF ID */
  let rafId: number | undefined;

  /** 节流后的函数 */
  function throttled(...args: Parameters<T>) {
    if (rafId !== undefined) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = undefined;
    });
  }

  /** 取消待执行的 rAF 回调 */
  function cancel() {
    if (rafId !== undefined) {
      cancelAnimationFrame(rafId);
      rafId = undefined;
    }
  }

  onBeforeUnmount(cancel);

  return {
    /** 节流后的函数 */
    throttled: throttled as T,
    /** 取消待执行的回调 */
    cancel,
  };
}
