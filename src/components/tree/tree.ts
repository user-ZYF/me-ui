import type { InjectionKey, PropType } from "vue";

import type {
  AllowDragFunction,
  AllowDropFunction,
  CheckedInfo,
  NodeDropType,
  RootTreeType,
  TreeComponentProps,
  TreeOptionProps,
  TreeData,
  TreeEventNode,
  TreeNodeData,
} from "./types";

/** fieldMap 默认字段映射（未传入字段时使用） */
export const DEFAULT_FIELD_MAP: TreeOptionProps = {
  children: "children",
  label: "label",
  disabled: "disabled",
  isLeaf: "isLeaf",
};

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
  fieldMap: {
    type: Object as PropType<TreeComponentProps["fieldMap"]>,
    default: () => ({ ...DEFAULT_FIELD_MAP }),
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
  "current-change": (_data: TreeNodeData | null, _node: TreeEventNode | null) => true,
  /** 节点被点击 */
  "node-click": (_data: TreeNodeData, _node: TreeEventNode, _evt: MouseEvent) =>
    true,
  /** 节点被右键点击 */
  "node-contextmenu": (_evt: Event, _data: TreeNodeData, _node: TreeEventNode) =>
    true,
  /** 节点折叠 */
  "node-collapse": (_data: TreeNodeData, _node: TreeEventNode) => true,
  /** 节点展开 */
  "node-expand": (_data: TreeNodeData, _node: TreeEventNode) => true,
  /** 节点复选框被点击（返回选中信息） */
  check: (_data: TreeNodeData, _checkedInfo: CheckedInfo) => true,
  /** 节点拖拽开始 */
  "node-drag-start": (_node: TreeEventNode, _evt: DragEvent) => true,
  /** 节点拖拽结束（无论是否成功放置） */
  "node-drag-end": (
    _draggingNode: TreeEventNode | null,
    _dropNode: TreeEventNode | null,
    _dropType: NodeDropType,
    _evt: DragEvent,
  ) => true,
  /** 节点拖拽放置成功（组件不修改 data，需外部根据参数自行更新数据） */
  "node-drop": (
    _draggingNode: TreeEventNode,
    _dropNode: TreeEventNode,
    _dropType: Exclude<NodeDropType, "none">,
    _evt: DragEvent,
  ) => true,
  /** 拖拽节点离开某可放置节点 */
  "node-drag-leave": (
    _draggingNode: TreeEventNode,
    _oldDropNode: TreeEventNode,
    _evt: DragEvent,
  ) => true,
  /** 拖拽节点进入某可放置节点 */
  "node-drag-enter": (_draggingNode: TreeEventNode, _dropNode: TreeEventNode, _evt: DragEvent) =>
    true,
  /** 拖拽节点经过某可放置节点 */
  "node-drag-over": (_draggingNode: TreeEventNode, _dropNode: TreeEventNode, _evt: DragEvent) =>
    true,
} as const;

/** Tree Emits 类型 */
export type TreeEmits = typeof treeEmits;

/** 注入 key */
export const ROOT_TREE_INJECTION_KEY: InjectionKey<RootTreeType> =
  Symbol("RootTree");
