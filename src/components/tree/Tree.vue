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
    @dragover="onContainerDragOver"
    @dragleave="onContainerDragLeave"
  >
    <!-- 虚拟滚动模式 -->
    <template v-if="virtual">
      <me-virtual-list
        ref="virtualListRef"
        :data="flattenNodes"
        :height="height"
        :item-height="itemHeight"
        :item-key="virtualItemKey"
        :overscan="overscan"
      >
        <template #default="{ item }">
          <tree-node
            :node="item"
            :indent="indent"
            :checkable="checkable"
            :draggable="draggable"
          >
            <template #default="scope">
              <slot v-bind="scope"></slot>
            </template>
          </tree-node>
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
          v-for="node in flattenNodes"
          :key="node.key"
          :node="node"
          :indent="indent"
          :checkable="checkable"
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
    <div v-if="isRootLoading" :class="ns.e('loading-block')">
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

import TreeNode from "./TreeNode.vue";
import { useDragNodeHandler } from "./composables/useDragNode";
import { useTreeData } from "./composables/useTreeData";
import { ROOT_TREE_INJECTION_KEY, treeEmits, treeProps } from "./tree";
import { conductCheck } from "./utils/conductUtil";
import {
  conductExpandParent,
  getAncestorEntities,
  isSameKeySet,
} from "./utils/treeUtil";

import { isNil } from "@me-ui/utils/types";

import type {
  DataEntity,
  TreeEventNode,
  TreeKey,
  TreeNodeData,
  TreeScrollToOptions,
} from "./types";

/**
 * 数据原则：
 * - props.data 是外部唯一数据源，组件在任何情况下都不修改它；
 * - 懒加载 resolve 的数据写入组件内部状态（loadedChildrenMap / loadedRootData），
 *   实体图由 props.data + 内部懒加载数据派生重建；
 * - 节点状态（选中/展开/当前等）全部由 key 集合派生，不挂在节点数据上；
 * - 需要外部配合的变更（如拖拽落点）通过事件通知，由外部决定是否更新 data。
 */
defineOptions({
  name: "MeTree",
});

const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

/** 默认选中 key */
const checkedKeys = defineModel<TreeKey[]>("checkedKeys", {
  default: () => [],
});
/** 默认展开 key */
const expandedKeys = defineModel<TreeKey[]>("expandedKeys", {
  default: () => [],
});
/** 当前节点 key */
const currentNodeKey = defineModel<TreeKey | undefined>("currentNodeKey", {
  default: undefined,
});

const ns = useNamespace("tree");
const slots = useSlots();

/** 容器元素引用 */
const container$ = ref<HTMLElement | null>(null);
/** 放置指示器引用 */
const dropIndicator$ = ref<HTMLElement | null>(null);
/** 虚拟列表引用 */
const virtualListRef = ref<InstanceType<typeof MeVirtualList>>();
/** 普通模式滚动条引用 */
const scrollbarRef = ref<InstanceType<typeof MeScrollbar>>();

/** 数据层 */
const {
  graph,
  keyEntities,
  expandedKeysSet,
  flattenNodes,
  isEmpty,
  isRootLoading,
  loadingKeys,
  loadedKeys,
  getLabel,
  getDisabled,
  getClass,
  isLeafEntity,
  canLoadEntity,
  createEventNodeBase,
  loadNodeData,
  expandEntity,
  collapseEntity,
  getEntity,
} = useTreeData({ props, expandedKeys });

/** 选中 key 集合 */
const checkedKeysSet = computed(() => new Set<TreeKey>(checkedKeys.value));

/**
 * 半选 key 集合
 */
const halfCheckedKeysSet = computed(() => {
  const halfSet = new Set<TreeKey>();
  if (props.checkStrictly) return halfSet;
  const checkedSet = checkedKeysSet.value;
  const { levelEntities, maxLevel } = graph.value;
  // 各实体勾选状态（自底向上填充，子实体总是先于父实体计算）
  const states = new Map<DataEntity, "checked" | "half" | "none">();

  for (let level = maxLevel; level >= 1; level--) {
    levelEntities.get(level)?.forEach((entity) => {
      // 禁用实体状态固定：不派生半选，也不向上透传子树状态
      if (getDisabled(entity)) {
        states.set(entity, checkedSet.has(entity.key) ? "checked" : "none");
        return;
      }
      // 禁用子实体不参与勾选传导（与 conductUp 口径一致）
      let hasCheckableChild = false;
      let allChecked = true;
      let partialChecked = false;
      for (const child of entity.children) {
        if (getDisabled(child)) continue;
        hasCheckableChild = true;
        const state = states.get(child) ?? "none";
        if (state !== "checked") allChecked = false;
        if (state !== "none") partialChecked = true;
      }
      if (checkedSet.has(entity.key) || (hasCheckableChild && allChecked)) {
        states.set(entity, "checked");
      } else if (partialChecked) {
        halfSet.add(entity.key);
        states.set(entity, "half");
      } else {
        states.set(entity, "none");
      }
    });
  }
  return halfSet;
});

/** 创建事件节点（实体数据 + 当前状态） */
function createEventNode(entity: DataEntity | null): TreeEventNode {
  const base = createEventNodeBase(entity);
  const key = entity?.key;
  return {
    ...base,
    expanded: !isNil(key) && expandedKeysSet.value.has(key),
    checked: !isNil(key) && checkedKeysSet.value.has(key),
    halfChecked: !isNil(key) && halfCheckedKeysSet.value.has(key),
    isCurrent: !isNil(key) && currentNodeKey.value === key,
  };
}

/**
 * 勾选传导写回：
 * 级联模式勾选/取消通过 conductCheck 围绕目标实体增量传导；
 * 未注册（懒加载未加载）的 key 仅更新集合，等待实体创建后生效。
 */
function applyCheck(entity: DataEntity, checked: boolean) {
  const key = entity.key;
  if (isNil(key)) return;
  const current = checkedKeys.value;

  if (!props.checkStrictly) {
    checkedKeys.value = conductCheck(
      [key],
      checked,
      current,
      graph.value,
      getDisabled,
    );
  } else {
    const set = new Set(current);
    if (checked) set.add(key);
    else set.delete(key);
    checkedKeys.value = [...set];
  }
}

/** 获取选中节点数据 */
function getCheckedNodes(
  leafOnly = false,
  includeHalfChecked = false,
): TreeNodeData[] {
  return graph.value.entities
    .filter((entity) => {
      if (leafOnly && !isLeafEntity(entity)) return false;
      if (checkedKeysSet.value.has(entity.key)) return true;
      return includeHalfChecked && halfCheckedKeysSet.value.has(entity.key);
    })
    .map((entity) => entity.data);
}

/** 获取选中 key */
function getCheckedKeys(leafOnly = false): TreeKey[] {
  return graph.value.entities
    .filter(
      (entity) =>
        checkedKeysSet.value.has(entity.key) &&
        (!leafOnly || isLeafEntity(entity)),
    )
    .map((entity) => entity.key);
}

/** 获取半选 key */
function getHalfCheckedKeys(): TreeKey[] {
  return graph.value.entities
    .filter((entity) => halfCheckedKeysSet.value.has(entity.key))
    .map((entity) => entity.key);
}

/** 获取半选节点数据 */
function getHalfCheckedNodes(): TreeNodeData[] {
  return graph.value.entities
    .filter((entity) => halfCheckedKeysSet.value.has(entity.key))
    .map((entity) => entity.data);
}

/** 节点勾选切换 */
function onNodeCheck(entity: DataEntity) {
  if (getDisabled(entity)) return;
  const checked = !checkedKeysSet.value.has(entity.key);
  applyCheck(entity, checked);
  emit("check", entity.data, {
    checkedKeys: getCheckedKeys(),
    checkedNodes: getCheckedNodes(),
    halfCheckedKeys: getHalfCheckedKeys(),
    halfCheckedNodes: getHalfCheckedNodes(),
  });
}

/** 收集实体祖先链上各层同级的 key（手风琴收拢用；子孙 key 保留以便重开恢复） */
function collectSiblingKeys(entity: DataEntity): Set<TreeKey> {
  const keys = new Set<TreeKey>();
  let node: DataEntity | null = entity;
  while (node) {
    for (const sibling of node.siblings) {
      if (sibling !== node && !isNil(sibling.key)) {
        keys.add(sibling.key);
      }
    }
    node = node.parent;
  }
  return keys;
}

/** 手风琴：收起实体及其祖先链上各层的同级实体 */
function collapseSiblings(entity: DataEntity) {
  const siblingKeys = collectSiblingKeys(entity);
  if (!siblingKeys.size) return;
  const list = expandedKeys.value.filter((key) => !siblingKeys.has(key));
  if (list.length !== expandedKeys.value.length) {
    expandedKeys.value = list;
  }
}

/** 展开实体（仅展开不折叠，含手风琴收拢；懒加载落地由 watcher 收拢同级） */
function onNodeExpand(entity: DataEntity) {
  if (props.accordion) {
    collapseSiblings(entity);
  }
  expandEntity(entity);
}

/** 节点展开/折叠切换 */
function toggleNodeExpand(entity: DataEntity) {
  if (expandedKeysSet.value.has(entity.key)) {
    collapseEntity(entity);
    return;
  }
  onNodeExpand(entity);
}

/** 设置当前节点 key */
function setCurrentNodeKey(key: TreeKey | null | undefined) {
  currentNodeKey.value = key ?? undefined;
  if (props.autoExpandParent && !isNil(key)) {
    const entity = keyEntities.value.get(key);
    if (entity) ensureExpandedAncestors(entity);
  }
}

/** 确保实体的祖先 key 都在展开集合中 */
function ensureExpandedAncestors(entity: DataEntity) {
  const missing = getAncestorEntities(entity)
    .filter((parent) => !expandedKeysSet.value.has(parent.key))
    .map((parent) => parent.key);
  if (missing.length) {
    expandedKeys.value = [...expandedKeys.value, ...missing];
  }
}

/** 节点点击 */
function onNodeClick(entity: DataEntity, event: MouseEvent) {
  setCurrentNodeKey(entity.key);
  emit("node-click", entity.data, createEventNode(entity), event);
}

/** 节点右键 */
function onNodeContextmenu(event: Event, entity: DataEntity) {
  emit("node-contextmenu", event, entity.data, createEventNode(entity));
}

/** 拖拽处理 */
const {
  dragState,
  onContainerDragOver,
  onContainerDragLeave,
} = useDragNodeHandler({
  props,
  ctx: { emit },
  container$,
  dropIndicator$,
  keyEntities,
  createEventNode,
  isLeafEntity,
  expandedKeysSet,
  onNodeExpand,
});

/**
 * 规范化 checkedKeys：
 * 勾选传导结果物化回写 model，保持父子联动状态一致；
 * 未注册（懒加载未加载）的 key 保留在 model 中等待实体创建后生效。
 */
watch(
  [graph, checkedKeys, () => props.checkStrictly],
  () => {
    if (props.checkStrictly) return;
    const g = graph.value;
    const current = checkedKeys.value;
    const conducted = conductCheck(current, true, [], g, getDisabled);
    if (!isSameKeySet(new Set(conducted), new Set(current))) {
      checkedKeys.value = conducted;
    }
  },
  { immediate: true },
);

/**
 * 规范化 expandedKeys：
 * - 实体图重建后，为已展开但未加载的懒加载实体触发加载
 * - autoExpandParent 下，为新 key / 图中新注册实体的 key 补齐祖先 key
 * - 手风琴下收拢新展开实体祖先链上的各级同级（数组中靠前的新 key 胜出）
 */
watch(
  [graph, expandedKeys, () => props.autoExpandParent],
  ([g, currentKeys, autoExpandParent], [prevG, prevKeys, prevAutoExpandParent]) => {
    const prevExpanded = new Set(prevKeys);
    const prevEntities = prevG?.keyEntities;
    // autoExpandParent 由关到开时，对全量 key 重新传导一次
    const becameAutoExpand = autoExpandParent && !prevAutoExpandParent;
    // key 是新增，或其实体刚注册进实体图（异步数据 / 懒加载落地）时视为新 key
    const isNewKey = (key: TreeKey) =>
      prevKeys === undefined ||
      becameAutoExpand ||
      !prevExpanded.has(key) ||
      !prevEntities?.has(key);

    // 先独立收集将被收拢的 key：靠前的新 key 胜出，
    // 被收拢的新 key 不再传播自己的同级
    const accordionKeysToRemove = new Set<TreeKey>();
    if (props.accordion) {
      for (const key of currentKeys) {
        if (accordionKeysToRemove.has(key) || !isNewKey(key)) continue;
        const entity = g.keyEntities.get(key);
        if (!entity) continue;
        for (const siblingKey of collectSiblingKeys(entity)) {
          accordionKeysToRemove.add(siblingKey);
        }
      }
    }

    const nextExpanded = new Set(currentKeys);
    const ancestorKeysToAdd: TreeKey[] = [];
    for (const key of currentKeys) {
      const entity = g.keyEntities.get(key);
      if (!entity) continue;
      // 将被收拢的 key：不触发加载、不补祖先
      if (accordionKeysToRemove.has(key)) continue;
      if (canLoadEntity(entity)) {
        loadNodeData(entity);
      }
      if (!isNewKey(key) || !autoExpandParent) continue;
      const conducted = conductExpandParent([key], g.keyEntities, getDisabled);
      for (const ancestorKey of conducted) {
        if (!nextExpanded.has(ancestorKey)) {
          nextExpanded.add(ancestorKey);
          ancestorKeysToAdd.push(ancestorKey);
        }
      }
    }

    if (accordionKeysToRemove.size || ancestorKeysToAdd.length) {
      const next = [
        ...currentKeys.filter((key) => !accordionKeysToRemove.has(key)),
        ...ancestorKeysToAdd.filter((key) => !accordionKeysToRemove.has(key)),
      ];
      // 内容未变（如收拢集合与当前 key 无交集）时不回写，避免冗余 emit
      if (!isSameKeySet(new Set(next), new Set(currentKeys))) {
        expandedKeys.value = next;
      }
    }
  },
  { immediate: true },
);

/** 当前节点变化时，按 autoExpandParent 展开其祖先 */
watch(
  currentNodeKey,
  (key) => {
    if (isNil(key)) return;
    const entity = keyEntities.value.get(key);
    if (entity && props.autoExpandParent) {
      ensureExpandedAncestors(entity);
    }
  },
  { immediate: true },
);

// ==================== 提供上下文 ====================

/** 树上下文（注入所有 TreeNode） */
provide(ROOT_TREE_INJECTION_KEY, {
  ctx: { emit, slots },
  props,
  keyEntities,
  expandedKeysSet,
  checkedKeysSet,
  halfCheckedKeysSet,
  loadingKeys,
  loadedKeys,
  currentNodeKey,
  dragState,
  isLeafEntity,
  getLabel,
  getDisabled,
  getClass,
  createEventNode,
  onNodeClick,
  onNodeContextmenu,
  toggleNodeExpand,
  onNodeCheck,
});

/** 获取节点（返回事件节点） */
function getNode(data: TreeKey | TreeNodeData | DataEntity) {
  const entity = getEntity(data);
  return entity ? createEventNode(entity) : null;
}

/** 实体是否在当前渲染树中可见（所有祖先均展开） */
function isEntityVisible(entity: DataEntity): boolean {
  return getAncestorEntities(entity).every((parent) =>
    expandedKeysSet.value.has(parent.key),
  );
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
  const entity = keyEntities.value.get(key);
  if (!entity) {
    console.warn("[Tree] scrollTo: 未找到 key 对应的节点", key);
    return false;
  }

  if (autoExpand) {
    // 展开目标节点的所有祖先节点
    ensureExpandedAncestors(entity);
  } else if (!isEntityVisible(entity)) {
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

/** 虚拟列表 itemKey */
function virtualItemKey(item: DataEntity): TreeKey {
  return item.key;
}

/** 设置选中 key（父子联动由归一化 watcher 传导） */
function setCheckedKeys(keys: TreeKey[]) {
  checkedKeys.value = [...keys];
}

/** 获取当前节点 key */
function getCurrentKey(): TreeKey | undefined {
  return currentNodeKey.value;
}

defineExpose({
  /** 获取节点 */
  getNode,
  /** 获取选中 key */
  getCheckedKeys,
  /** 获取选中节点数据 */
  getCheckedNodes,
  /** 设置选中 key */
  setCheckedKeys,
  /** 获取半选 key */
  getHalfCheckedKeys,
  /** 获取半选节点数据 */
  getHalfCheckedNodes,
  /** 获取当前节点 key */
  getCurrentKey,
  /** 设置当前节点 key */
  setCurrentNodeKey,
  /** 滚动到指定节点 */
  scrollTo,
});
</script>
