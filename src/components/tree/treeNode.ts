import type { PropType } from 'vue';

import type { DataEntity } from './types';

/** TreeNode Props 定义 */
export const treeNodeProps = {
  /** 扁平化可见节点实体 */
  node: {
    type: Object as PropType<DataEntity>,
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
    default: false,
  },
  /** 可拖拽 */
  draggable: {
    type: Boolean,
    default: false,
  },
} as const;
