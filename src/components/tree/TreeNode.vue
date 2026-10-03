<!-- 树节点（扁平化渲染，普通 / 虚拟滚动共用） -->
<template>
  <div
    ref="node$"
    :class="[
      ns.b.value,
      ns.is('expanded', expanded),
      ns.is('current', isCurrent),
      ns.is('checked', checkedState === CheckedState.CHECKED),
      ns.is('indeterminate', checkedState === CheckedState.INDETERMINATE),
      ns.is('drop-inner', isDropInner),
      customClass,
    ]"
    :data-tree-key="keyValue"
    :draggable="draggable"
    @click.stop="handleClick"
    @contextmenu="handleContextmenu"
    @dragstart.stop="handleDragStart"
    @dragover.stop.prevent="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop.prevent
  >
    <div
      :class="ns.e('content')"
      :style="{ paddingLeft: `${(node.level - 1) * indent}px` }"
    >
      <me-icon
        :class="[
          ns.e('expand-icon'),
          expanded && 'expanded',
          isLeaf && 'is-leaf',
        ]"
        :size="12"
        @click.stop="handleExpandIconClick"
      >
        <CaretRight />
      </me-icon>
      <me-icon
        v-if="loading"
        :class="ns.e('loading-icon')"
        :size="12"
      >
        <Loading />
      </me-icon>
      <me-checkbox
        v-if="checkable"
        :model-value="checkedState === CheckedState.CHECKED"
        :indeterminate="checkedState === CheckedState.INDETERMINATE"
        :disabled="disabled"
        @click.stop
        @change="handleCheckChange"
      />
      <div :class="ns.e('label')">
        <slot :node="eventNode" :data="node.data">
          {{ label }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toRef, watch } from "vue";
import { CaretRight, Loading } from "@element-plus/icons-vue";

import MeCheckbox from "@me-ui/components/checkbox";
import MeIcon from "@me-ui/components/icon";
import { useNamespace } from "@me-ui/hooks/use-namespace";

import { dragEventsKey } from "./composables/useDragNode";
import { ROOT_TREE_INJECTION_KEY } from "./tree";
import { treeNodeProps } from "./treeNode";

import type { VNode } from "vue";
import type { DragEvents } from "./composables/useDragNode";
import type {
  RootTreeType,
  TreeEventNode,
  TreeNodeData,
} from "./types";
import { CheckedState } from "./types";

defineOptions({
  name: "MeTreeNode",
});

const props = defineProps(treeNodeProps);

defineSlots<{
  default?(props: { node: TreeEventNode; data: TreeNodeData }): VNode[];
}>();

const ns = useNamespace("tree-node");

/** 树上下文 */
const rootTree = inject<RootTreeType>(ROOT_TREE_INJECTION_KEY)!;
/** 拖拽事件 */
const dragEvents = inject<DragEvents>(dragEventsKey)!;

const node = toRef(props, "node");
const node$ = ref<HTMLElement | null>(null);

/** 节点 key 值 */
const keyValue = computed(() => node.value.key);
/** 是否展开（由展开 key 集合派生） */
const expanded = computed(() =>
  rootTree.expandedKeysSet.value.has(keyValue.value),
);
/** 选中状态（由选中/半选 key 集合派生） */
const checkedState = computed(() =>
  rootTree.checkedKeysSet.value.has(keyValue.value)
    ? CheckedState.CHECKED
    : rootTree.halfCheckedKeysSet.value.has(keyValue.value)
      ? CheckedState.INDETERMINATE
      : CheckedState.UNCHECKED,
);
/** 是否当前节点 */
const isCurrent = computed(
  () => rootTree.currentNodeKey.value === keyValue.value,
);
/** 是否叶子 */
const isLeaf = computed(() => rootTree.isLeafEntity(node.value));
/** 是否禁用 */
const disabled = computed(() => rootTree.getDisabled(node.value));
/** 自定义类名（fieldMap.class） */
const customClass = computed(() => rootTree.getClass(node.value));
/** 标签 */
const label = computed(() => rootTree.getLabel(node.value));
/** 是否加载中（懒加载） */
const loading = computed(() =>
  rootTree.loadingKeys.has(keyValue.value),
);
/** 是否为拖拽放置内部目标（由拖拽状态派生） */
const isDropInner = computed(() => {
  const state = rootTree.dragState.value;
  return (
    state.dropType === "inner" &&
    state.dropNode?.node.key === keyValue.value
  );
});
/** 事件节点（插槽对外暴露） */
const eventNode = computed(() => rootTree.createEventNode(node.value));

/** 处理点击 */
function handleClick(e: MouseEvent) {
  rootTree.onNodeClick(node.value, e);
}

/** 处理右键 */
function handleContextmenu(e: Event) {
  rootTree.onNodeContextmenu(e, node.value);
}

/** 处理展开图标点击 */
function handleExpandIconClick() {
  if (isLeaf.value) return;
  rootTree.toggleNodeExpand(node.value);
}

/** 处理复选框变化 */
function handleCheckChange() {
  if (disabled.value) return;
  rootTree.onNodeCheck(node.value);
}

/** 监听展开状态，发射 node-expand / node-collapse 事件 */
watch(
  expanded,
  (expanded) => {
    if (expanded) {
      rootTree.ctx.emit("node-expand", node.value.data, eventNode.value);
    } else {
      rootTree.ctx.emit("node-collapse", node.value.data, eventNode.value);
    }
  },
);

/** 监听选中状态，发射 check-change 事件 */
watch(
  checkedState,
  (state) => {
    rootTree.ctx.emit(
      "check-change",
      node.value.data,
      state === CheckedState.CHECKED,
      state === CheckedState.INDETERMINATE,
    );
  },
);

/** 监听当前节点状态，发射 current-change 事件 */
watch(
  isCurrent,
  (isCurrent) => {
    if (isCurrent) {
      rootTree.ctx.emit("current-change", node.value.data, eventNode.value);
    }
  },
);

/** 处理拖拽开始 */
function handleDragStart(e: DragEvent) {
  if (!props.draggable) return;
  dragEvents.treeNodeDragStart({
    event: e,
    treeNode: {
      node: node.value,
      $el: node$.value!
    },
  });
}

/** 处理拖拽经过 */
function handleDragOver(e: DragEvent) {
  if (!props.draggable) return;
  dragEvents.treeNodeDragOver({
    event: e,
    treeNode: { node: node.value, $el: node$.value! },
  });
}

/** 处理拖拽结束 */
function handleDragEnd(e: DragEvent) {
  if (!props.draggable) return;
  dragEvents.treeNodeDragEnd(e);
}

/** 暴露方法 */
defineExpose({
  node$,
  expand: () => {
    if (!expanded.value) rootTree.toggleNodeExpand(node.value);
  },
  collapse: () => {
    if (expanded.value) rootTree.toggleNodeExpand(node.value);
  },
});
</script>
