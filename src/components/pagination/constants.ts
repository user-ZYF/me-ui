import type { Component, ComputedRef, InjectionKey, WritableComputedRef } from 'vue';

import Prev from './components/prev.vue';
import Next from './components/next.vue';
import Pager from './components/pager.vue';
import Total from './components/total.vue';
import Jumper from './components/jumper.vue';
import Sizes from './components/sizes.vue';

import type { PaginationLayoutComponentKey } from './pagination';

/** Pagination 组件上下文 */
export interface MePaginationContext {
  /** 当前页码 */
  currentPage: WritableComputedRef<number>;
  /** 总页数 */
  pageCount: ComputedRef<number>;
  /** 是否禁用 */
  disabled: ComputedRef<boolean>;
  /** 页码变化事件 */
  handleCurrentChange: (val: number) => void;
  /** 每页条数变化事件 */
  handleSizeChange: (val: number) => void;
  /** 上一页 */
  prev: () => void;
  /** 下一页 */
  next: () => void;
}

/** Pagination 注入 key */
export const mePaginationKey: InjectionKey<MePaginationContext> = Symbol('mePaginationKey');

/** 布局组件映射 */
export const componentMap: Record<PaginationLayoutComponentKey, Component> = {
  prev: Prev,
  next: Next,
  pager: Pager,
  total: Total,
  jumper: Jumper,
  sizes: Sizes,
};
