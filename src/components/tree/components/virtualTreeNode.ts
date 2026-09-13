import type { PropType } from 'vue';

import type Node from '../model/node';

/** VirtualTreeNode Props 定义 */
export const virtualTreeNodeProps = {
  /** 节点 */
  node: {
    type: Object as PropType<Node>,
    required: true,
  },
  /** 缩进 */
  indent: {
    type: Number,
    required: true,
  },
  /** 显示复选框 */
  checkable: {
    type: Boolean,
    required: true,
  },
  /** 可拖拽 */
  draggable: {
    type: Boolean,
    required: true,
  },
  /** 手风琴模式 */
  accordion: {
    type: Boolean,
    required: true,
  },
} as const;
