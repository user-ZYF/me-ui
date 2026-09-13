import { reactive } from "vue";

import {
  isBoolean,
  isArray,
  isFunction,
  isNil,
  isString,
  isUndefined,
} from "@me-ui/utils/types";

import { isNode } from "./util";

import type TreeStore from "./tree-store";
import type {
  TreeKey,
  TreeOptionProps,
  TreeNodeData,
  TreeNodeOptions,
} from "../types";
import { CheckedState, LoadState } from "../types";

/** 根据子节点计算父节点的选中状态 */
export function getChildState(nodes: Node[]): CheckedState {
  if (nodes.length === 0) return CheckedState.UNCHECKED;
  if (nodes.every((n) => n.checkedState === CheckedState.CHECKED)) {
    return CheckedState.CHECKED;
  }
  if (nodes.every((n) => n.checkedState === CheckedState.UNCHECKED)) {
    return CheckedState.UNCHECKED;
  }
  return CheckedState.INDETERMINATE;
}

/** 重新初始化选中状态 */
function reInitChecked(node: Node) {
  if (node.childNodes.length === 0 || node.loadState === LoadState.LOADING) {
    return;
  }

  node.checkedState = getChildState(node.childNodes);

  const parent = node.parent;
  if (!parent || parent.level === 0) return;

  if (!node.store.checkStrictly) {
    reInitChecked(parent);
  }
}

/** 从数据中获取属性 */
function getPropertyFromData(node: Node, prop: string) {
  const props = node.store.props;
  const data = node.data || {};
  const config = props[prop as keyof TreeOptionProps];

  if (isFunction(config)) {
    return config(data, node);
  } else if (isString(config)) {
    return data[config];
  }
  return data[prop];
}

/** 树节点类 */
export class Node {
  /** 选中状态 */
  checkedState: CheckedState = CheckedState.UNCHECKED;
  /** 数据 */
  data!: TreeNodeData;
  /** 是否展开 */
  expanded: boolean = false;
  /** 父节点 */
  parent: Node | null = null;
  /** 是否当前 */
  isCurrent: boolean = false;
  /** 树存储 */
  store!: TreeStore;
  /** 用户定义的叶子节点 */
  isLeafByUser: boolean | undefined = undefined;
  /** 层级 */
  level: number = 0;
  /** 加载状态 */
  loadState: LoadState = LoadState.IDLE;
  /** 子节点 */
  childNodes: Node[] = [];

  /** 是否为拖拽放置内部目标 */
  isDropInner: boolean = false;

  constructor(options: TreeNodeOptions) {
    this.data = options.data;
    this.store = options.store;
    this.parent = options.parent ?? null;
    this.checkedState = options.checkedState ?? CheckedState.UNCHECKED;
    this.level = this.parent ? this.parent.level + 1 : 0;
  }

  /** 初始化 */
  initialize() {
    const store = this.store;
    if (!store) {
      throw new Error("[Node]store is required!");
    }

    // 将节点注册到store的nodesMap中
    store.registerNode(this);

    const props = store.props;
    if (props && !isUndefined(props.isLeaf)) {
      const isLeaf = getPropertyFromData(this, "isLeaf");
      if (isBoolean(isLeaf)) {
        this.isLeafByUser = isLeaf;
      }
    }

    if (!store.lazy) {
      this.buildChildren();
    }

    const defaultExpandedKeys = store.defaultExpandedKeys;

    if (!isNil(this.keyValue) && defaultExpandedKeys.includes(this.keyValue)) {
      this.expand(null, store.autoExpandParent);
    }

    if (
      !isUndefined(store.currentNodeKey) &&
      this.keyValue === store.currentNodeKey
    ) {
      if (store.currentNode) {
        store.currentNode.isCurrent = false;
      }
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }

    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }
  }

  /** 构建子节点 */
  buildChildren(datas?: TreeNodeData[]) {
    let children = datas;
    if (!children) {
      if (this.level === 0 && isArray(this.data)) {
        children = this.data;
      } else {
        children = getPropertyFromData(this, "children") || [];
      }
    }

    for (const child of children!) {
      this.insertChild(child);
    }
  }

  /** 标签 */
  get label(): string {
    return getPropertyFromData(this, "label");
  }

  /** key 值 */
  get keyValue(): TreeKey | undefined {
    // 根节点没有key
    if (this.level === 0) {
      return undefined;
    }
    const nodeKey = this.store.keyName;
    return this.data[nodeKey];
  }

  /** 是否禁用 */
  get disabled(): boolean {
    return getPropertyFromData(this, "disabled");
  }

  /** 是否叶子节点 */
  get isLeaf(): boolean {
    if (
      this.store.lazy &&
      this.loadState !== LoadState.LOADED &&
      !isUndefined(this.isLeafByUser)
    ) {
      return this.isLeafByUser;
    }
    if (
      !this.store.lazy ||
      (this.store.lazy && this.loadState === LoadState.LOADED)
    ) {
      return this.childNodes.length === 0;
    }
    return false;
  }

  /** 下一个兄弟节点 */
  get nextSibling(): Node | null {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index < parent.childNodes.length - 1
          ? parent.childNodes[index + 1]
          : null;
      }
    }
    return null;
  }

  /** 上一个兄弟节点 */
  get previousSibling(): Node | null {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index > 0 ? parent.childNodes[index - 1] : null;
      }
    }
    return null;
  }

  /** 是否包含目标节点 */
  contains(target: Node, deep = true): boolean {
    return this.childNodes.some(
      (child) => child === target || (deep && child.contains(target)),
    );
  }

  /** 移除节点 */
  remove() {
    const parent = this.parent;
    if (parent) {
      parent.removeChild(this);
    }
  }

  /** 插入子节点 */
  insertChild(child?: TreeNodeData | Node, index?: number): Node {
    if (!child) throw new Error("InsertChild error: child is required.");

    if (!isNode(child)) {
      // 同步数据
      const children = this.getChildren(true)!;
      if (!children.includes(child)) {
        if (index === undefined || index < 0) {
          children.push(child);
        } else {
          children.splice(index, 0, child);
        }
      }
      child = reactive(
        new Node({ data: child, parent: this, store: this.store }),
      );
      child.initialize();
    }

    (child as Node).level = this.level + 1;

    if (index === undefined || index < 0) {
      this.childNodes.push(child as Node);
    } else {
      this.childNodes.splice(index, 0, child as Node);
    }

    return child as Node;
  }

  /** 在参考节点前插入 */
  insertBefore(child: TreeNodeData | Node, ref: Node) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }

  /** 在参考节点后插入 */
  insertAfter(child: TreeNodeData | Node, ref: Node) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }

  /** 移除子节点 */
  removeChild(child: Node) {
    const children = this.getChildren() || [];
    const dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }
  }

  /** 展开 */
  expand(callback?: (() => void) | null, expandParent?: boolean) {
    // 叶子节点无展开意义，跳过避免被误标记为 expanded
    if (this.isLeaf) {
      if (callback) callback();
      return;
    }

    const done = () => {
      if (expandParent) {
        let parent = this.parent;
        // 根节点（level = 0）是容器节点，不进行渲染
        while (parent && parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) callback();
    };

    if (this.shouldLoadData) {
      this.loadData((data) => {
        if (isArray(data)) {
          if (!this.store.checkStrictly) {
            if (this.checkedState === CheckedState.CHECKED) {
              this.setChecked(CheckedState.CHECKED, true);
            } else {
              reInitChecked(this);
            }
          }
          done();
        }
      });
    } else {
      done();
    }
  }

  /** 折叠 */
  collapse() {
    this.expanded = false;
  }

  /** 是否应该加载数据 */
  get shouldLoadData(): boolean {
    return Boolean(
      this.store.lazy && this.store.load && this.loadState !== LoadState.LOADED,
    );
  }

  /** 设置选中 */
  setChecked(
    /** 选中状态 */
    value: CheckedState,
    /** 是否级联关联节点 */
    cascade?: boolean,
    /** 是否为内部递归调用 */
    recursion?: boolean,
  ) {
    this.checkedState = value;

    // 非级联模式下，只设置自己
    if (!cascade) return;

    // 级联模式下，需要同步更新子节点的状态
    if (!this.shouldLoadData) {
      const childNodes = this.childNodes;
      for (const child of childNodes) {
        child.setChecked(value, cascade, true);
      }
    }

    const parent = this.parent;
    if (!parent || parent.level === 0) return;

    if (!recursion) {
      // 向上更新祖先节点的状态
      reInitChecked(parent);
    }
  }

  /** 获取子节点数据 */
  getChildren(forceInit = false): TreeNodeData | TreeNodeData[] | undefined {
    if (this.level === 0) return this.data;
    const data = this.data;

    const props = this.store.props;
    let children = "children";
    if (props) {
      children = props.children || "children";
    }

    if (forceInit && !data[children]) {
      data[children] = [];
    }

    return data[children];
  }

  /** 加载数据 */
  loadData(callback: (data?: TreeNodeData[]) => void) {
    if (this.shouldLoadData && this.loadState !== LoadState.LOADING) {
      this.loadState = LoadState.LOADING;

      const resolve = (children: TreeNodeData[]) => {
        this.buildChildren(children);
        this.loadState = LoadState.LOADED;

        if (callback) {
          callback.call(this, children);
        }
      };
      const reject = () => {
        this.loadState = LoadState.IDLE;
      };

      this.store.load!(this, resolve, reject);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  }

  /** （先根遍历）遍历节点 */
  eachNode(callback: (node: Node) => void) {
    const stack: Node[] = [this];
    while (stack.length) {
      const node = stack.pop()!;
      callback(node);
      // 逆序入栈，保证子节点按正序出栈
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        stack.push(node.childNodes[i]);
      }
    }
  }

  /** 重新初始化选中状态 */
  reInitChecked() {
    if (this.store.checkStrictly) return;
    reInitChecked(this);
  }
}

export default Node;
