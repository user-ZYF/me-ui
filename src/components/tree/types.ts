import type {
  ComputedRef,
  ModelRef,
  Ref,
  SetupContext,
  Slots,
} from "vue";

import type { treeEmits } from "./tree";

/** 树组件 emit 方法 */
export type TreeEmitFn = SetupContext<typeof treeEmits>["emit"];

/** 节点 key */
export type TreeKey = string | number;

/** 节点数据（原始数据） */
export type TreeNodeData = Record<string, any>;

/** 树数据 */
export type TreeData = TreeNodeData[];

/** 树字段映射 */
export interface TreeOptionProps {
  /** 子节点字段名 */
  children?: string;
  /** 标签字段名 */
  label?: string | ((data: TreeNodeData, node: DataEntity) => string);
  /** 禁用字段名 */
  disabled?: string | ((data: TreeNodeData, node: DataEntity) => boolean);
  /** 叶子节点字段名 */
  isLeaf?: string | ((data: TreeNodeData, node: DataEntity) => boolean);
  /** 自定义类名字段名 */
  class?:string | ((data: TreeNodeData, node: DataEntity) => string | Record<string, boolean>);
}

/** 树组件 props */
export interface TreeComponentProps {
  /** 数据 */
  data?: TreeData;
  /** 是否懒加载 */
  lazy?: boolean;
  /** 节点 key 的字段名 */
  nodeKey: string;
  /** 字段映射 */
  fieldMap?: TreeOptionProps;
  /** 是否显示复选框 */
  checkable?: boolean;
  /** 缩进距离（px） */
  indent?: number;
  /** 懒加载函数 */
  load?: LoadFunction;
  /** 展开节点后自动展开父节点 */
  autoExpandParent?: boolean;
  /** 复选框严格模式（父子不联动） */
  checkStrictly?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 是否允许拖拽节点 */
  allowDrag?: AllowDragFunction;
  /** 是否允许放置节点 */
  allowDrop?: AllowDropFunction;
  /** 手风琴模式 */
  accordion?: boolean;
  /** 虚拟滚动 */
  virtual?: boolean;
  /** 容器高度（px） */
  height?: number;
  /** 虚拟列表项高度（px） */
  itemHeight?: number;
  /** 虚拟列表额外渲染项数 */
  overscan?: number;
  /** 普通模式最大高度（px） */
  maxHeight?: string | number;
}

/**
 * 数据实体
 * 由 data 转换而来，只描述位置与引用，不携带状态
 */
export interface DataEntity {
  /** 节点 key */
  key: TreeKey;
  /** 位置路径（如 "0-1-2"） */
  pos: string;
  /** 层级（顶层为 1） */
  level: number;
  /** 同级索引 */
  index: number;
  /** 原始数据 */
  data: TreeNodeData;
  /** 父实体（顶层节点为 null） */
  parent: DataEntity | null;
  /** 同级实体列表（含自身，顶层节点为顶层数组） */
  siblings: DataEntity[];
  /** 子实体 */
  children: DataEntity[];
}

/** 实体图 */
export interface EntityGraph {
  /** 全量实体（先根遍历序） */
  entities: DataEntity[];
  /** 全量实体集合（用于实体判定） */
  entitySet: Set<DataEntity>;
  /** 顶层实体 */
  topEntities: DataEntity[];
  /** key → 实体 */
  keyEntities: Map<TreeKey, DataEntity>;
  /** 层级 → 该层实体集合 */
  levelEntities: Map<number, Set<DataEntity>>;
  /** 最大层级 */
  maxLevel: number;
}

/**
 * 事件节点基础信息（懒加载 load / allowDrag / allowDrop 等回调的入参）
 * 实体数据 + 字段解析结果
 */
export interface TreeEventNodeBase {
  /** 节点 key */
  key: TreeKey | undefined;
  /** 位置路径 */
  pos: string;
  /** 层级 */
  level: number;
  /** 同级索引 */
  index: number;
  /** 原始数据 */
  data: TreeNodeData | null;
  /** 父实体 */
  parent: DataEntity | null;
  /** 标签（按 fieldMap 解析） */
  label: string;
  /** 是否禁用（按 fieldMap 解析） */
  disabled: boolean;
  /** 是否叶子 */
  isLeaf: boolean;
  /** 子节点是否加载中 */
  loading: boolean;
}

/**
 * 事件节点
 * = 实体数据 + 字段解析结果 + 当前状态快照
 */
export interface TreeEventNode extends TreeEventNodeBase {
  /** 是否展开 */
  expanded: boolean;
  /** 是否选中 */
  checked: boolean;
  /** 是否半选 */
  halfChecked: boolean;
  /** 是否当前节点 */
  isCurrent: boolean;
}

/** 是否允许拖拽节点 */
export type AllowDragFunction = (node: TreeEventNode) => boolean;

/** 放置类型（允许） */
export type AllowDropType = "before" | "inner" | "after";

/** 放置类型 */
export type NodeDropType = "before" | "inner" | "after" | "none";

/** 是否允许放置节点 */
export type AllowDropFunction = (
  draggingNode: TreeEventNode,
  dropNode: TreeEventNode,
  type: AllowDropType,
) => boolean;

/** 懒加载函数 */
export type LoadFunction = (
  node: TreeEventNodeBase,
  resolve: (data?: TreeNodeData[]) => void,
  stopLoading: () => void,
) => void;

/** 节点选中状态 */
export enum CheckedState {
  /** 未选中 */
  UNCHECKED = 0,
  /** 半选中 */
  INDETERMINATE = 1,
  /** 选中 */
  CHECKED = 2,
}

/** 拖拽节点 */
export interface DragTreeNode {
  /** 节点实体 */
  node: DataEntity;
  /** DOM 元素 */
  $el?: HTMLElement;
}

/** 拖拽状态 */
export interface DragState {
  /** 放置类型 */
  dropType: NodeDropType;
  /** 正在被拖拽节点 */
  draggingNode: DragTreeNode | null;
  /** 是否显示放置指示器 */
  showDropIndicator: boolean;
  /** 放置节点 */
  dropNode: DragTreeNode | null;
}

/** 复选框信息 */
export interface CheckedInfo {
  /** 选中的 key */
  checkedKeys: TreeKey[];
  /** 选中的节点数据 */
  checkedNodes: TreeNodeData[];
  /** 半选的 key */
  halfCheckedKeys: TreeKey[];
  /** 半选的节点数据 */
  halfCheckedNodes: TreeNodeData[];
}

/** 滚动到节点的选项 */
export interface TreeScrollToOptions {
  /** 目标节点 key */
  key: TreeKey;
  /** 对齐方式：顶部 / 底部 / 自动 */
  align?: "top" | "bottom" | "auto";
  /** 额外偏移量（px），正数向下 */
  offset?: number;
  /** 滚动行为：瞬时 / 平滑 */
  behavior?: "auto" | "smooth";
  /** 是否自动展开祖先节点（默认 true） */
  autoExpand?: boolean;
}

/** 根树事件上下文 */
export interface RootTreeContext {
  /** 发射事件 */
  emit: TreeEmitFn;
  /** 插槽 */
  slots: Slots;
}

/** 树上下文（注入所有 TreeNode） */
export interface RootTreeType {
  ctx: RootTreeContext;
  props: TreeComponentProps;
  /** key → 实体 */
  keyEntities: ComputedRef<Map<TreeKey, DataEntity>>;
  /** 展开 key 集合 */
  expandedKeysSet: ComputedRef<Set<TreeKey>>;
  /** 选中 key 集合 */
  checkedKeysSet: ComputedRef<Set<TreeKey>>;
  /** 半选 key 集合 */
  halfCheckedKeysSet: ComputedRef<Set<TreeKey>>;
  /** 加载中 key（懒加载） */
  loadingKeys: Set<TreeKey>;
  /** 已加载 key（懒加载） */
  loadedKeys: Set<TreeKey>;
  /** 当前节点 key */
  currentNodeKey: ModelRef<TreeKey | undefined>;
  /** 拖拽状态 */
  dragState: Ref<DragState>;
  /** 判断实体是否叶子 */
  isLeafEntity(entity: DataEntity): boolean;
  /** 解析实体标签 */
  getLabel(entity: DataEntity): string;
  /** 解析实体禁用状态 */
  getDisabled(entity: DataEntity): boolean;
  /** 解析实体自定义类名（fieldMap.class） */
  getClass(entity: DataEntity): string | Record<string, boolean>;
  /** 创建事件节点（实体数据 + 当前状态） */
  createEventNode(entity: DataEntity | null): TreeEventNode;
  /** 节点点击 */
  onNodeClick(entity: DataEntity, event: MouseEvent): void;
  /** 节点右键 */
  onNodeContextmenu(event: Event, entity: DataEntity): void;
  /** 节点展开/折叠切换（懒加载节点会先加载；手风琴模式收起同级） */
  toggleNodeExpand(entity: DataEntity): void;
  /** 节点勾选切换（联动由 conductCheck 完成） */
  onNodeCheck(entity: DataEntity): void;
}
