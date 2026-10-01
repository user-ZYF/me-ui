<!-- ? 树组件 -->
<template>
  <div
    ref="container$"
    :class="[
      ns.b.value,
      ns.m('highlight-current'),
      ns.is('virtual', !!virtual),
      ns.is('draggable', !!draggable),
      ns.is('dragging', !!dragState.draggingNode),
    ]"
  >
    <!-- 虚拟滚动模式 -->
    <template v-if="virtual">
      <me-virtual-list
        ref="virtualListRef"
        :data="flattenTree"
        :height="height"
        :item-height="itemHeight"
        :item-key="virtualItemKey"
        :overscan="overscan"
      >
        <template #default="{ item }">
          <virtual-tree-node
            :node="item"
            :indent="indent"
            :checkable="checkable"
            :draggable="draggable"
            :accordion="accordion"
          >
            <template #default="scope">
              <slot v-bind="scope"></slot>
            </template>
          </virtual-tree-node>
        </template>
      </me-virtual-list>
    </template>

    <!-- 普通模式 -->
    <template v-else>
      <me-scrollbar
        ref="scrollbarRef"
        :max-height="maxHeight"
      >
        <tree-node
          v-for="child in root.childNodes"
          :key="child.keyValue"
          :node="child"
          :props="props.props"
          :accordion="accordion"
          :checkable="checkable"
          :node-key="nodeKey"
          :indent="indent"
          :lazy="lazy"
          :draggable="draggable"
        >
          <template #default="scope">
            <slot v-bind="scope"></slot>
          </template>
        </tree-node>
      </me-scrollbar>
    </template>

    <!-- 空状态 -->
    <div v-if="isEmpty" :class="ns.e('empty-block')">
      <slot name="empty">
        <span :class="ns.e('empty-text')">暂无数据</span>
      </slot>
    </div>

    <!-- 懒加载根节点 loading -->
    <div v-if="isLoading" :class="ns.e('loading-block')">
      <me-icon :class="ns.e('loading-icon')" :size="16">
        <Loading />
      </me-icon>
      <span :class="ns.e('loading-text')">加载中...</span>
    </div>

    <!-- 拖拽放置指示器 -->
    <div
      v-show="dragState.showDropIndicator"
      ref="dropIndicator$"
      :class="ns.e('drop-indicator')"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  getCurrentInstance,
  nextTick,
  provide,
  ref,
  useSlots,
  watch,
} from "vue";
import { Loading } from "@element-plus/icons-vue";

import MeIcon from "@me-ui/components/icon";
import MeScrollbar from "@me-ui/components/scrollbar";
import MeVirtualList from "@me-ui/components/virtual-list";
import { useNamespace } from "@me-ui/hooks/use-namespace";

import TreeNode from "./components/TreeNode.vue";
import VirtualTreeNode from "./components/VirtualTreeNode.vue";
import { useDragNodeHandler } from "./composables/useDragNode";
import TreeStore from "./model/tree-store";
import { ROOT_TREE_INJECTION_KEY, treeEmits, treeProps } from "./tree";

import type {
  TreeEmitFn,
  TreeKey,
  TreeNodeData,
  TreeScrollToOptions,
} from "./types";
import type Node from "./model/node";
import { LoadState } from "./types";

defineOptions({
  name: "MeTree",
});

const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

/** 默认选中 key（v-model） */
const checkedKeys = defineModel<TreeKey[]>("checkedKeys", {
  default: () => [],
});
/** 默认展开 key（v-model） */
const expandedKeys = defineModel<TreeKey[]>("expandedKeys", {
  default: () => [],
});
/** 当前节点 key（v-model） */
const currentNodeKey = defineModel<TreeKey | undefined>("currentNodeKey", {
  default: undefined,
});

const ns = useNamespace("tree");
const instance = getCurrentInstance()!;
const slots = useSlots();

/** 容器元素引用 */
const container$ = ref<HTMLElement | null>(null);
/** 放置指示器引用 */
const dropIndicator$ = ref<HTMLElement | null>(null);
/** 虚拟列表引用 */
const virtualListRef = ref<InstanceType<typeof MeVirtualList>>();
/** 普通模式滚动条引用 */
const scrollbarRef = ref<InstanceType<typeof MeScrollbar>>();

/** 创建树存储 */
function createStore() {
  const store = new TreeStore({
    keyName: props.nodeKey,
    data: props.data,
    lazy: props.lazy,
    props: props.props,
    load: props.load,
    autoExpandParent: props.autoExpandParent,
    checkStrictly: props.checkStrictly,
    currentNodeKey: currentNodeKey.value,
    defaultCheckedKeys: checkedKeys.value,
    defaultExpandedKeys: expandedKeys.value,
  });
  store.initialize();
  return store;
}

/** 树存储 */
const store = ref<TreeStore>(createStore());

/** 根节点 */
const root = computed(() => store.value.root);
/** 当前节点 */
const currentNode = computed(() => store.value.currentNode);

/** 是否为空 */
const isEmpty = computed(() => {
  // 懒加载根节点正在加载时，不显示空状态
  if (props.lazy && root.value.loadState === LoadState.LOADING) return false;
  if (props.virtual) {
    return !flattenTree.value || flattenTree.value.length === 0;
  }
  const childNodes = root.value.childNodes;
  return !childNodes || childNodes.length === 0;
});

/** 懒加载根节点是否正在加载 */
const isLoading = computed(
  () => props.lazy && root.value.loadState === LoadState.LOADING,
);

/** 拖拽处理 */
const { dragState } = useDragNodeHandler({
  props,
  ctx: { emit },
  container$,
  dropIndicator$,
  store,
});

/** 内部更新标记*/
let isInternalUpdate = false;

/** 在内部更新期间执行操作，避免触发 watcher 回写 store */
function withInternalUpdate<T>(fn: () => T): T {
  isInternalUpdate = true;
  const result = fn();
  nextTick(() => {
    isInternalUpdate = false;
  });
  return result;
}

/** 包装 emit，同步 v-model */
const wrappedEmit: TreeEmitFn = (event: string, ...args: any[]) => {
  (emit as (event: string, ...args: any[]) => void)(event, ...args);
  switch (event) {
    case "node-expand":
    case "node-collapse":
      withInternalUpdate(() => {
        expandedKeys.value = getExpandedKeys();
      });
      break;
    case "check-change":
    case "check":
      withInternalUpdate(() => {
        checkedKeys.value = store.value.getCheckedKeys();
      });
      break;
    case "current-change":
      withInternalUpdate(() => {
        currentNodeKey.value = args[1]
          ? (args[1] as Node).keyValue ?? undefined
          : undefined;
      });
      break;
  }
};

/** 提供根树注入 */
provide(ROOT_TREE_INJECTION_KEY, {
  ctx: { emit: wrappedEmit, slots },
  props,
  store,
  root,
  currentNode,
  instance,
});

// ==================== 普通模式方法 ====================

/** 获取节点 */
function getNode(data: TreeKey | TreeNodeData | Node): Node | null {
  return store.value.getNode(data);
}

/** 获取半选 key */
function getHalfCheckedKeys(): TreeKey[] {
  return store.value.getHalfCheckedKeys();
}

/** 获取展开 key */
function getExpandedKeys(): TreeKey[] {
  const keys: TreeKey[] = [];
  root.value.eachNode((node) => {
    if (node.expanded) {
      keys.push(node.keyValue as TreeKey);
    }
  });
  return keys;
}

/** 节点是否在当前渲染树中可见（所有祖先均展开） */
function isNodeVisible(node: Node): boolean {
  let parent: Node | null = node.parent;
  while (parent && parent.level > 0) {
    if (!parent.expanded) return false;
    parent = parent.parent;
  }
  return true;
}

/** 滚动到指定节点，返回是否成功（节点存在且可见/可展开） */
function scrollTo(options: TreeScrollToOptions): boolean {
  const {
    key,
    align = "auto",
    offset = 0,
    behavior = "auto",
    autoExpand = true,
  } = options;
  const node = store.value.getNode(key);
  if (!node) {
    console.warn("[Tree] scrollTo: 未找到 key 对应的节点", key);
    return false;
  }

  if (autoExpand) {
    // 展开目标节点的所有祖先节点
    let parent: Node | null = node.parent;
    while (parent && parent.level > 0) {
      parent.expanded = true;
      parent = parent.parent;
    }
    withInternalUpdate(() => {
      expandedKeys.value = getExpandedKeys();
    });
  } else if (!isNodeVisible(node)) {
    // 节点被隐藏，无法被定位
    return false;
  }

  nextTick(() => {
    if (props.virtual) {
      virtualListRef.value?.scrollTo({ key, align, offset, behavior });
    } else {
      // 通过滚动条组件暴露的方法滚动，避免直接操作 DOM
      const scrollbar = scrollbarRef.value;
      const container = scrollbar?.wrapRef;
      if (!container) return;
      const nodeEl = container.querySelector<HTMLElement>(
        `[data-tree-key="${String(key)}"]`,
      );
      if (!nodeEl) return;
      // 节点在容器滚动内容中的位置
      const containerRect = container.getBoundingClientRect();
      const nodeRect = nodeEl.getBoundingClientRect();
      const nodeTop = nodeRect.top - containerRect.top + container.scrollTop;
      const nodeBottom = nodeTop + nodeRect.height;
      const containerHeight = container.clientHeight;
      // 根据对齐方式计算目标 scrollTop，offset 语义与虚拟模式一致
      let targetTop: number;
      if (align === "top") {
        targetTop = nodeTop - offset;
      } else if (align === "bottom") {
        targetTop = nodeBottom - containerHeight - offset;
      } else {
        // auto：节点已可见则不滚动，否则滚到最近的可见边界
        const scrollTop = container.scrollTop;
        if (nodeTop < scrollTop) {
          targetTop = nodeTop - offset;
        } else if (nodeBottom > scrollTop + containerHeight) {
          targetTop = nodeBottom - containerHeight - offset;
        } else {
          // 节点已在可视区内，无需滚动
          return;
        }
      }
      // 使用滚动条组件暴露的 setScrollTop，会同步更新滑块位置
      scrollbar?.setScrollTop(targetTop, behavior === "smooth");
    }
  });
  return true;
}

// ==================== 虚拟模式 ====================

/** 扁平化树数据（虚拟滚动用） */
const flattenTree = computed(() => {
  const result: Node[] = [];
  const stack: Node[] = [];
  // 逆序入栈，保证子节点按正序出栈
  for (let i = root.value.childNodes.length - 1; i >= 0; i--) {
    stack.push(root.value.childNodes[i]);
  }
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    if (node.expanded && node.childNodes.length) {
      for (let i = node.childNodes.length - 1; i >= 0; i--) {
        stack.push(node.childNodes[i]);
      }
    }
  }
  return result;
});

/** 虚拟列表 itemKey */
function virtualItemKey(item: Node): TreeKey {
  return item.keyValue as TreeKey;
}

// ==================== 监听 ====================

/** 监听数据变化 */
watch(
  () => props.data,
  () => {
    // data 引用改变时，重建整棵树，依据当前 v-model 恢复展开/勾选等状态
    store.value = createStore();
  },
);

/** 监听默认选中 key */
watch(checkedKeys, (newVal) => {
  if (isInternalUpdate) return;
  store.value.setDefaultCheckedKey(newVal);
});

/** 监听默认展开 key */
watch(expandedKeys, (newVal) => {
  if (isInternalUpdate) return;
  store.value.setDefaultExpandedKey(newVal);
});

/** 监听当前节点 key */
watch(currentNodeKey, (newVal) => {
  if (isInternalUpdate) return;
  store.value.setCurrentNodeKey(newVal, props.autoExpandParent);
});

/** 监听 checkStrictly */
watch(
  () => props.checkStrictly,
  (newVal) => {
    store.value.checkStrictly = newVal;
  },
);

// ==================== 暴露方法 ====================

defineExpose({
  /** 获取节点 */
  getNode,
  /** 获取半选 key */
  getHalfCheckedKeys,
  /** 滚动到指定节点 */
  scrollTo,
});
</script>
