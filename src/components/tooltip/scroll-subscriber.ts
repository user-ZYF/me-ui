/** scroll/resize 订阅回调集合 */
const subscribers = new Set<() => void>();
/** rAF ID */
let rafId: number | undefined;
/** 是否已注册全局监听 */
let initialized = false;

/** 全局 scroll/resize 事件处理（模块级单例，不依赖 setup 环境） */
function onGlobalScroll() {
  if (rafId !== undefined) return;
  rafId = requestAnimationFrame(()=>{
    rafId = undefined;
    subscribers.forEach((fn) => fn());
  });
}

/** 确保全局监听已注册 */
function ensureListener() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('scroll', onGlobalScroll, { capture: true });
  window.addEventListener('resize', onGlobalScroll);
}

/** 无订阅者时移除全局监听 */
function maybeRemoveListener() {
  if (!initialized || subscribers.size > 0) return;
  initialized = false;
  window.removeEventListener('scroll', onGlobalScroll, { capture: true });
  window.removeEventListener('resize', onGlobalScroll);
}

/** 添加 scroll/resize 订阅 */
export function addScrollSubscriber(fn: () => void) {
  ensureListener();
  subscribers.add(fn);
}

/** 移除 scroll/resize 订阅 */
export function removeScrollSubscriber(fn: () => void) {
  subscribers.delete(fn);
  maybeRemoveListener();
}
