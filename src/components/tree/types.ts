import type { ComponentInternalInstance, Ref, SetupContext, Slots } from 'vue';

import type Node from './model/node';
import type TreeStore from './model/tree-store';
import type { treeEmits } from './tree';

/** 树 emit 函数类型 */
export type TreeEmitFn = SetupContext<typeof treeEmits>['emit'];

/** 根树上下文 */
export interface RootTreeContext {
  /** emit 函数 */
  emit: TreeEmitFn;
  /** 插槽 */
  slots: Slots;
}

/** 根树类型 */
export interface RootTreeType {
  ctx: RootTreeContext;
  props: TreeComponentProps;
  store: Ref<TreeStore>;
  root: Ref<Node>;
  currentNode: Ref<Node | null>;
  instance: ComponentInternalInstance;
}

/** 树数据 */
export type TreeData = TreeNodeData[];

/** 树节点 key 值类型 */
export type TreeKey = string | number;

/** 树节点数据 */
export type TreeNodeData = Record<string, any>;

/** 节点选中状态 */
export enum CheckedState {
  /** 未选中 */
  UNCHECKED,
  /** 已选中 */
  CHECKED,
  /** 半选 */
  INDETERMINATE,
}

/** 节点加载状态 */
export enum LoadState {
  /** 空闲（未加载/加载失败） */
  IDLE,
  /** 加载中 */
  LOADING,
  /** 已加载 */
  LOADED,
}

/** 节点选项 */
export interface TreeNodeOptions {
  /** 节点数据 */
  data: TreeNodeData;
  /** 树存储 */
  store: TreeStore;
  /** 父节点 */
  parent?: Node;
  /** 初始选中状态（懒加载默认选中） */
  checkedState?: CheckedState;
}

/** 树存储节点映射 */
export interface TreeStoreNodesMap {
  [key: string]: Node;
}

/** 树存储选项 */
export interface TreeStoreOptions {
  /** 节点 key 字段名 */
  keyName: string;
  /** 数据 */
  data: TreeData;
  /** 是否懒加载 */
  lazy: boolean;
  /** 属性映射 */
  props: TreeOptionProps;
  /** 加载函数 */
  load?: LoadFunction;
  /** 当前节点 key */
  currentNodeKey?: TreeKey;
  /** 是否严格模式 */
  checkStrictly: boolean;
  /** 默认选中 key */
  defaultCheckedKeys: TreeKey[];
  /** 默认展开 key */
  defaultExpandedKeys: TreeKey[];
  /** 自动展开父节点 */
  autoExpandParent: boolean;
}

/** 树选项属性 */
export interface TreeOptionProps {
  /** 子节点字段名 */
  children?: string;
  /** 标签字段名或函数 */
  label?: string | ((data: TreeNodeData, node: Node) => string);
  /** 值字段名 */
  value?: string;
  /** 禁用字段名或函数 */
  disabled?: string | ((data: TreeNodeData, node: Node) => boolean);
  /** 是否叶子节点字段名或函数 */
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  /** 自定义类名函数 */
  class?: (data: TreeNodeData, node: Node) => string | { [key: string]: boolean };
}

/** 允许拖拽函数 */
export type AllowDragFunction = (node: Node) => boolean;

/** 允许放置类型（与 node-drop / node-drag-end 事件的 dropType 命名保持一致） */
export type AllowDropType = 'inner' | 'before' | 'after';

/** 允许放置函数 */
export type AllowDropFunction = (
  draggingNode: Node,
  dropNode: Node,
  type: AllowDropType,
) => boolean;

/** 加载函数 */
export type LoadFunction = (
  rootNode: Node,
  loadedCallback: (data: TreeData) => void,
  stopLoading: () => void,
) => void;

/** 树组件属性 */
export interface TreeComponentProps {
  /** 数据 */
  data: TreeData;
  /** 节点 key */
  nodeKey: string;
  /** 严格模式 */
  checkStrictly: boolean;
  /** 自动展开父节点 */
  autoExpandParent: boolean;
  /** 显示复选框 */
  checkable: boolean;
  /** 可拖拽 */
  draggable: boolean;
  /** 允许拖拽函数 */
  allowDrag?: AllowDragFunction;
  /** 允许放置函数 */
  allowDrop?: AllowDropFunction;
  /** 属性映射 */
  props?: TreeOptionProps;
  /** 懒加载 */
  lazy: boolean;
  /** 加载函数 */
  load?: LoadFunction;
  /** 手风琴模式 */
  accordion: boolean;
  /** 缩进 */
  indent: number;
  /** 虚拟滚动 */
  virtual: boolean;
  /** 普通模式滚动区域最大高度（超出后出现滚动条） */
  maxHeight: string | number;
  /** 虚拟滚动高度 */
  height: number;
  /** 虚拟滚动项高度 */
  itemHeight: number;
  /** 虚拟滚动额外渲染项数 */
  overscan: number;
}

/** 节点放置类型 */
export type NodeDropType = 'before' | 'after' | 'inner' | 'none';

/** 选中信息 */
export interface CheckedInfo {
  /** 选中 key */
  checkedKeys: TreeKey[];
  /** 选中节点 */
  checkedNodes: TreeData;
  /** 半选 key */
  halfCheckedKeys: TreeKey[];
  /** 半选节点 */
  halfCheckedNodes: TreeData;
}

/** Tree scrollTo 配置 */
export interface TreeScrollToOptions {
  /** 目标节点 key */
  key: TreeKey;
  /** 对齐方式，默认 'auto' */
  align?: 'top' | 'bottom' | 'auto';
  /** 额外偏移量（px），正数向下偏移，负数向上偏移，默认 0 */
  offset?: number;
  /** 滚动行为，默认 'auto' */
  behavior?: 'auto' | 'smooth';
  /** 是否自动展开目标节点的所有祖先节点，默认 true */
  autoExpand?: boolean;
}
