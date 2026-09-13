<!-- ? 虚拟树节点 -->
<template>
  <div
    ref="node$"
    :class="[
      ns.b.value,
      ns.is('expanded', node.expanded),
      ns.is('current', node.isCurrent),
      ns.is('checked', node.checkedState === CheckedState.CHECKED),
      ns.is('indeterminate', node.checkedState === CheckedState.INDETERMINATE),
      ns.is('drop-inner', node.isDropInner),
    ]"
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
          node.expanded && 'expanded',
          node.isLeaf && 'is-leaf',
        ]"
        :size="12"
        @click.stop="handleExpandIconClick"
      >
        <CaretRight />
      </me-icon>
      <me-icon
        v-if="node.loadState === LoadState.LOADING"
        :class="ns.e('loading-icon')"
        :size="12"
      >
        <Loading />
      </me-icon>
      <me-checkbox
        v-if="checkable"
        :model-value="node.checkedState === CheckedState.CHECKED"
        :indeterminate="node.checkedState === CheckedState.INDETERMINATE"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange"
      />
      <div :class="ns.e('label')">
        <slot :node="node" :data="node.data">
          {{ node.label }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, toRef } from 'vue';
import { CaretRight, Loading } from '@element-plus/icons-vue';

import MeCheckbox from '@me-ui/components/checkbox';
import MeIcon from '@me-ui/components/icon';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { useTreeNode } from '../composables/useTreeNode';
import { virtualTreeNodeProps } from './virtualTreeNode';

import type { VNode } from 'vue';
import type { TreeNodeData } from '../types';
import type Node from '../model/node';
import { CheckedState, LoadState } from '../types';

defineOptions({
  name: 'MeVirtualTreeNode',
});

const props = defineProps(virtualTreeNodeProps);

defineSlots<{
  default?(props: { node: Node; data: TreeNodeData }): VNode[];
}>();

const ns = useNamespace('tree-node');
const instance = getCurrentInstance()!;
const node$ = ref<HTMLElement | null>(null);

const {
  handleClick,
  handleContextmenu,
  handleExpandIconClick,
  handleCheckChange,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
} = useTreeNode({
  node: toRef(props, 'node'),
  draggable: toRef(props, 'draggable'),
  accordion: toRef(props, 'accordion'),
  node$: node$,
  instance,
});

defineExpose({
  node$,
});
</script>
