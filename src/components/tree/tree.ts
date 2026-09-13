import type { ComponentInternalInstance, InjectionKey, PropType } from "vue";

import type Node from "./model/node";
import type {
  AllowDragFunction,
  AllowDropFunction,
  CheckedInfo,
  NodeDropType,
  RootTreeType,
  TreeComponentProps,
  TreeData,
  TreeNodeData,
} from "./types";

/** Tree Props 定义 */
export const treeProps = {
  /** 数据 */
  data: {
    type: Array as PropType<TreeData>,
    default: () => [],
  },
  /** 节点 key */
  nodeKey: {
    type: String,
    required: true,
  },
  /** 严格模式（父子check状态不联动） */
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  /** 自动展开父节点 */
  autoExpandParent: {
    type: Boolean,
    default: true,
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
  /** 允许拖拽函数 */
  allowDrag: {
    type: Function as PropType<AllowDragFunction>,
    default: undefined,
  },
  /** 允许放置函数 */
  allowDrop: {
    type: Function as PropType<AllowDropFunction>,
    default: undefined,
  },
  /** 属性映射 */
  props: {
    type: Object as PropType<TreeComponentProps["props"]>,
    default: () => ({
      children: "children",
      label: "label",
      disabled: "disabled",
      isLeaf: "isLeaf",
    }),
  },
  /** 懒加载 */
  lazy: {
    type: Boolean,
    default: false,
  },
  /** 加载函数 */
  load: {
    type: Function as PropType<TreeComponentProps["load"]>,
    default: undefined,
  },
  /** 手风琴模式 */
  accordion: {
    type: Boolean,
    default: false,
  },
  /** 缩进 */
  indent: {
    type: Number,
    default: 18,
  },
  /** 虚拟滚动 */
  virtual: {
    type: Boolean,
    default: false,
  },
  /** 普通模式滚动区域最大高度（超出后出现滚动条） */
  maxHeight: {
    type: [String, Number] as PropType<string | number>,
    default: "",
  },
  /** 虚拟滚动高度 */
  height: {
    type: Number,
    default: 200,
  },
  /** 虚拟滚动项高度 */
  itemHeight: {
    type: Number,
    default: 26,
  },
  /** 虚拟滚动额外渲染项数 */
  overscan: {
    type: Number,
    default: 5,
  },
} as const;

/** Tree Emits 定义 */
export const treeEmits = {
  /** 节点复选框选中状态变化 */
  "check-change": (
    _data: TreeNodeData,
    _checked: boolean,
    _indeterminate: boolean,
  ) => true,
  /** 当前选中节点变化 */
  "current-change": (_data: TreeNodeData | null, _node: Node | null) => true,
  /** 节点被点击 */
  "node-click": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null,
    _evt: MouseEvent,
  ) => true,
  /** 节点被右键点击 */
  "node-contextmenu": (
    _evt: Event,
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null,
  ) => true,
  /** 节点折叠 */
  "node-collapse": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null,
  ) => true,
  /** 节点展开 */
  "node-expand": (
    _data: TreeNodeData,
    _node: Node,
    _nodeInstance: ComponentInternalInstance | null,
  ) => true,
  /** 节点复选框被点击（返回选中信息） */
  check: (_data: TreeNodeData, _checkedInfo: CheckedInfo) => true,
  /** 节点拖拽开始 */
  "node-drag-start": (_node: Node, _evt: DragEvent) => true,
  /** 节点拖拽结束（无论是否成功放置） */
  "node-drag-end": (
    _draggingNode: Node | null,
    _dropNode: Node | null,
    _dropType: NodeDropType,
    _evt: DragEvent,
  ) => true,
  /** 节点拖拽放置成功 */
  "node-drop": (
    _draggingNode: Node,
    _dropNode: Node,
    _dropType: Exclude<NodeDropType, "none">,
    _evt: DragEvent,
  ) => true,
  /** 拖拽节点离开某可放置节点 */
  "node-drag-leave": (
    _draggingNode: Node,
    _oldDropNode: Node,
    _evt: DragEvent,
  ) => true,
  /** 拖拽节点进入某可放置节点 */
  "node-drag-enter": (_draggingNode: Node, _dropNode: Node, _evt: DragEvent) =>
    true,
  /** 拖拽节点经过某可放置节点 */
  "node-drag-over": (_draggingNode: Node, _dropNode: Node, _evt: DragEvent) =>
    true,
} as const;

/** Tree Emits 类型 */
export type TreeEmits = typeof treeEmits;

/** 注入 key */
export const ROOT_TREE_INJECTION_KEY: InjectionKey<RootTreeType> =
  Symbol("RootTree");
export const NODE_INSTANCE_INJECTION_KEY: InjectionKey<ComponentInternalInstance> =
  Symbol("NodeInstance");
