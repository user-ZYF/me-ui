import { reactive } from "vue";

import { isArray, isNil, isObject } from "@me-ui/utils/types";

import Node from "./node";
import { isNode } from "./util";

import type {
  LoadFunction,
  TreeData,
  TreeKey,
  TreeNodeData,
  TreeOptionProps,
  TreeStoreNodesMap,
  TreeStoreOptions,
} from "../types";
import { CheckedState, LoadState } from "../types";

/** 树存储类 */
export default class TreeStore {
  /** 当前节点 */
  currentNode: Node | null;
  /** 当前节点 key */
  currentNodeKey: TreeKey | null | undefined;
  /** 节点映射 */
  nodesMap: TreeStoreNodesMap;
  /** 根节点 */
  root!: Node;
  /** 数据 */
  data!: TreeData;
  /** 是否懒加载 */
  lazy = false;
  /** 加载函数 */
  load?: LoadFunction;
  /** 节点 key 字段名 */
  keyName!: string;
  /** 默认选中 key */
  defaultCheckedKeys!: TreeKey[];
  /** 严格模式 */
  checkStrictly = false;
  /** 默认展开 key */
  defaultExpandedKeys!: TreeKey[];
  /** 自动展开父节点 */
  autoExpandParent = true;
  /** 属性映射 */
  props!: TreeOptionProps;

  constructor(options: TreeStoreOptions) {
    this.currentNode = null;
    this.nodesMap = {};

    Object.assign(this, options);
  }

  /** 初始化 */
  initialize() {
    this.root = reactive(
      new Node({
        data: this.data,
        store: this,
      }),
    );

    this.root.initialize();

    if (this.lazy && this.load) {
      if (isArray(this.data) && this.data.length > 0) {
        // 渲染初始数据
        this.root.buildChildren();
        this.root.loadState = LoadState.LOADED;
        this._initDefaultCheckedNodes();
      } else {
        // 没有初始数据，进行首次加载
        const loadFn = this.load;
        this.root.loadState = LoadState.LOADING;
        loadFn(
          this.root,
          (data) => {
            this.root.buildChildren(data);
            this.root.loadState = LoadState.LOADED;
            this._initDefaultCheckedNodes();
          },
          () => {
            this.root.loadState = LoadState.IDLE;
          },
        );
      }
    } else {
      this._initDefaultCheckedNodes();
    }
  }

  /** 获取节点 */
  getNode(data: TreeKey | TreeNodeData | Node): Node | null {
    if (isNode(data)) return data;
    const key = isObject(data) ? data?.[this.keyName] : data;
    return this.nodesMap[key] || null;
  }

  /** 在参考节点前插入 */
  insertBefore(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node) {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertBefore(data, refNode);
  }

  /** 在参考节点后插入 */
  insertAfter(data: TreeNodeData, refData: TreeKey | TreeNodeData | Node) {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertAfter(data, refNode);
  }

  /** 移除节点 */
  remove(data: TreeNodeData | Node) {
    const node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.parent.removeChild(node);
    }
  }

  /** 初始化默认选中节点 */
  _initDefaultCheckedNodes() {
    const defaultCheckedKeySet = new Set(
      this.defaultCheckedKeys.map((key) => String(key)),
    );
    const nodesMap = this.nodesMap;

    for (const key in nodesMap) {
      const node = nodesMap[key];
      if (defaultCheckedKeySet.has(key)) {
        node.setChecked(CheckedState.CHECKED, !this.checkStrictly);
      } else if (node.checkedState !== CheckedState.UNCHECKED) {
        node.setChecked(CheckedState.UNCHECKED, !this.checkStrictly);
      }
    }
  }

  /** 初始化默认选中节点（懒加载） */
  _initDefaultCheckedNode(node: Node) {
    const defaultCheckedKeys = this.defaultCheckedKeys;

    if (!isNil(node.keyValue) && defaultCheckedKeys.includes(node.keyValue)) {
      node.setChecked(CheckedState.CHECKED, !this.checkStrictly);
    }
  }

  /** 设置默认选中 key */
  setDefaultCheckedKey(newVal: TreeKey[]) {
    if (newVal !== this.defaultCheckedKeys) {
      this.defaultCheckedKeys = newVal;
      this._initDefaultCheckedNodes();
    }
  }

  /** 注册节点 */
  registerNode(node: Node) {
    if (!node.data) return;

    const nodeKey = node.keyValue;
    if (!isNil(nodeKey)) this.nodesMap[nodeKey] = node;
  }

  /** 注销节点 */
  deregisterNode(node: Node) {
    if (!node.data) return;

    node.childNodes.forEach((child) => {
      this.deregisterNode(child);
    });

    const nodeKey = node.keyValue;
    if (!isNil(nodeKey)) delete this.nodesMap[nodeKey];
  }

  /** 获取选中节点 */
  getCheckedNodes(
    leafOnly = false,
    includeHalfChecked = false,
  ): TreeNodeData[] {
    const checkedNodes: TreeNodeData[] = [];
    this.root.eachNode((node) => {
      if (
        (node.checkedState === CheckedState.CHECKED ||
          (includeHalfChecked &&
            node.checkedState === CheckedState.INDETERMINATE)) &&
        (!leafOnly || (leafOnly && node.isLeaf))
      ) {
        checkedNodes.push(node.data);
      }
    });
    return checkedNodes;
  }

  /** 获取选中 key */
  getCheckedKeys(leafOnly = false): TreeKey[] {
    return this.getCheckedNodes(leafOnly).map(
      (data) => (data || {})[this.keyName],
    );
  }

  /** 获取半选节点 */
  getHalfCheckedNodes(): TreeNodeData[] {
    const nodes: TreeNodeData[] = [];
    this.root.eachNode((node) => {
      if (node.checkedState === CheckedState.INDETERMINATE) {
        nodes.push(node.data);
      }
    });
    return nodes;
  }

  /** 获取半选 key */
  getHalfCheckedKeys(): TreeKey[] {
    return this.getHalfCheckedNodes().map((data) => (data || {})[this.keyName]);
  }

  /** 设置默认展开 key */
  setDefaultExpandedKey(keys: TreeKey[]) {
    keys = keys || [];
    const keySet = new Set(keys.map((k) => String(k)));
    this.defaultExpandedKeys = keys;

    this.root.eachNode((node) => {
      if (node.level === 0) return;
      const shouldExpand = keySet.has(String(node.keyValue));
      if (shouldExpand && !node.expanded) {
        node.expand(null, this.autoExpandParent);
      } else if (!shouldExpand && node.expanded) {
        node.collapse();
      }
    });
  }

  /** 设置选中 */
  setChecked(
    data: TreeKey | TreeNodeData,
    checked: CheckedState,
    cascade: boolean,
  ) {
    const node = this.getNode(data);

    if (node) {
      node.setChecked(checked, cascade);
    }
  }

  /** 设置当前节点 */
  setCurrentNode(currentNode: Node) {
    const prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  }

  /** 设置当前节点 key */
  setCurrentNodeKey(
    key: TreeKey | null | undefined,
    shouldAutoExpandParent = true,
  ) {
    this.currentNodeKey = key;
    if (isNil(key)) {
      if (this.currentNode) {
        this.currentNode.isCurrent = false;
      }
      this.currentNode = null;
      return;
    }
    const node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
      if (
        shouldAutoExpandParent &&
        this.currentNode &&
        this.currentNode.level > 1
      ) {
        this.currentNode.parent?.expand(null, true);
      }
    }
  }
}
