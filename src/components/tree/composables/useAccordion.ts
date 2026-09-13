import { toValue } from 'vue';

import type { MaybeRefOrGetter } from 'vue';
import type Node from '../model/node';

/** useAccordion 选项 */
export interface UseAccordionOptions {
  /** 当前节点 */
  node: MaybeRefOrGetter<Node>;
  /** 是否开启手风琴模式 */
  accordion: MaybeRefOrGetter<boolean>;
}

/**
 * 手风琴模式 hook
 *
 * 展开当前节点前，收起同级的兄弟节点。
 * 直接基于数据模型（node.parent.childNodes）操作，不依赖组件嵌套层级，
 * 因此同时适用于普通模式和虚拟滚动模式。
 */
export function useAccordion(options: UseAccordionOptions) {
  /** 收起当前节点的同级兄弟节点（手风琴模式生效） */
  function collapseSiblings() {
    if (!toValue(options.accordion)) return;
    const node = toValue(options.node);
    const parent = node.parent;
    if (!parent) return;
    for (const sibling of parent.childNodes) {
      if (sibling !== node && sibling.expanded) {
        sibling.collapse();
      }
    }
  }

  return { collapseSiblings };
}
