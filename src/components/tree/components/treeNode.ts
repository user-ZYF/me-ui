import type { PropType } from 'vue';

import type Node from '../model/node';
import type { TreeOptionProps } from '../types';

/** TreeNode Props 定义 */
export const treeNodeProps = {
  /** 节点 */
  node: {
    type: Object as PropType<Node>,
    required: true,
  },
  /** 属性映射配置 */
  props: {
    type: Object as PropType<TreeOptionProps>,
    required: true,
  },
  /** 手风琴 */
  accordion: {
    type: Boolean,
    required: true,
  },
  /** 显示复选框 */
  checkable: {
    type: Boolean,
    required: true,
  },
  /** 节点 key */
  nodeKey: {
    type: String,
    required: true,
  },
  /** 缩进 */
  indent: {
    type: Number,
    required: true,
  },
  /** 懒加载 */
  lazy: {
    type: Boolean,
    default: undefined,
  },
  /** 可拖拽 */
  draggable: {
    type: Boolean,
    required: true,
  },
} as const;
