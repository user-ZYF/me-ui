/** 列表项 key 获取函数 */
export type ItemKey<T = any> = (item: T) => any;

/**
 * 可见区间计算结果
 */
export interface VisibleRange {
  /**
   * 列表总高度（所有项高度累加），
   * 虚拟模式下用于撑开滚动条；非虚拟模式下为 undefined
   */
  totalHeight?: number;
  /** 可见区间起始索引（含） */
  startIndex: number;
  /** 可见区间结束索引（含） */
  endIndex: number;
  /**
   * 可见区间在总高度中的垂直偏移量（px），
   * 用于 translateY 定位可见项；非虚拟模式下为 undefined
   */
  offset?: number;
}

/**
 * 滚动对齐方式
 * - 'top'：目标项顶部对齐容器顶部
 * - 'bottom'：目标项底部对齐容器底部
 * - 'auto'：智能对齐，仅当目标项不在可视区域内时才滚动 —— 目标在上方时对齐顶部，在下方时对齐底部，已可见则不滚动
 */
export type ScrollAlign = 'top' | 'bottom' | 'auto';

/**
 * 滚动行为
 * - 'auto'：瞬间跳转到目标位置
 * - 'smooth'：平滑滚动到目标位置
 */
export type ScrollBehavior = 'auto' | 'smooth';

/** 滚动通用配置 */
export interface ScrollBaseConfig {
  /** 对齐方式，默认 'top' */
  align?: ScrollAlign;
  /** 额外偏移量（px），正数向下偏移，负数向上偏移，默认 0 */
  offset?: number;
  /** 滚动行为，默认 'auto' */
  behavior?: ScrollBehavior;
}

/** 滚动到指定索引配置 */
export interface ScrollToIndex extends ScrollBaseConfig {
  /** 滚动到指定索引 */
  index: number;
}

/** 滚动到指定 key 配置 */
export interface ScrollToKey extends ScrollBaseConfig {
  /** 滚动到指定 key */
  key: any;
}

/** 滚动配置（按索引或按 key 二选一） */
export type ScrollConfig = ScrollToIndex | ScrollToKey;

/** 类型守卫：是否为按索引滚动 */
export function isScrollToIndex(arg: ScrollConfig): arg is ScrollToIndex {
  return 'index' in arg && arg.index !== undefined;
}

/** 类型守卫：是否为按 key 滚动 */
export function isScrollToKey(arg: ScrollConfig): arg is ScrollToKey {
  return 'key' in arg;
}

/**
 * 滚动到指定位置
 * @param arg 传数字则直接滚动到该 scrollTop 值；传 ScrollConfig 则滚动到指定索引或 key；传 undefined 不滚动
 */
export type ScrollTo = (arg: number | ScrollConfig | undefined) => void;
