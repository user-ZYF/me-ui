import { computed, inject, watch } from 'vue';

import { useAccordion } from './useAccordion';
import { dragEventsKey } from './useDragNode';
import { ROOT_TREE_INJECTION_KEY } from '../tree';

import type { ComponentInternalInstance, Ref } from 'vue';
import type { DragEvents } from './useDragNode';
import type { RootTreeType } from '../types';
import type Node from '../model/node';
import { CheckedState } from '../types';

/** useTreeNode 选项 */
export interface UseTreeNodeOptions {
  /** 当前节点 */
  node: Ref<Node>;
  /** 是否可拖拽 */
  draggable: Ref<boolean>;
  /** 是否开启手风琴模式 */
  accordion: Ref<boolean>;
  /** 节点 DOM 元素引用 */
  node$: Ref<HTMLElement | null>;
  /** 组件实例 */
  instance: ComponentInternalInstance;
}

/** 树节点共享逻辑 */
export function useTreeNode(options: UseTreeNodeOptions) {
  const { node, draggable, accordion, node$: nodeEl, instance } = options;

  /** 根树 */
  const rootTree = inject<RootTreeType>(ROOT_TREE_INJECTION_KEY)!;
  /** 拖拽事件 */
  const dragEvents = inject<DragEvents>(dragEventsKey)!;

  /** 树存储 */
  const store = computed(() => node.value.store);

  /** 手风琴模式 */
  const { collapseSiblings } = useAccordion({
    node,
    accordion,
  });

  /** 处理点击 */
  function handleClick(e: MouseEvent) {
    store.value.setCurrentNodeKey(node.value.keyValue);
    rootTree?.ctx.emit('node-click', node.value.data, node.value, instance, e);
  }

  /** 处理右键 */
  function handleContextmenu(e: Event) {
    rootTree?.ctx.emit(
      'node-contextmenu',
      e,
      node.value.data,
      node.value,
      instance,
    );
  }

  /** 展开节点 */
  function expand() {
    if (!node.value.expanded) {
      collapseSiblings();
      node.value.expand();
    }
  }

  /** 折叠节点 */
  function collapse() {
    if (node.value.expanded) {
      node.value.collapse();
    }
  }

  /** 处理展开图标点击 */
  function handleExpandIconClick() {
    if (node.value.isLeaf) return;
    if (node.value.expanded) {
      collapse();
    } else {
      expand();
    }
  }

  /** 处理复选框变化 */
  function handleCheckChange(value: boolean) {
    if (node.value.disabled) return;
    const checkStrictly = store.value.checkStrictly;
    const childNodes = node.value.childNodes;
    if (!checkStrictly && childNodes.length) {
      value = childNodes.some(
        (n) => n.checkedState !== CheckedState.CHECKED,
      );
    }
    node.value.setChecked(
      value ? CheckedState.CHECKED : CheckedState.UNCHECKED,
      !checkStrictly,
    );
    const s = store.value;
    rootTree?.ctx.emit('check', node.value.data, {
      checkedKeys: s.getCheckedKeys(),
      checkedNodes: s.getCheckedNodes(),
      halfCheckedKeys: s.getHalfCheckedKeys(),
      halfCheckedNodes: s.getHalfCheckedNodes(),
    });
  }

  /** 监听选中状态，发射 check-change 事件 */
  watch(
    () => node.value.checkedState,
    (state) => {
      rootTree?.ctx.emit(
        'check-change',
        node.value.data,
        state === CheckedState.CHECKED,
        state === CheckedState.INDETERMINATE,
      );
    },
  );

  /** 监听展开状态，发射 node-expand / node-collapse 事件 */
  watch(
    () => node.value.expanded,
    (expanded) => {
      if (expanded) {
        rootTree?.ctx.emit('node-expand', node.value.data, node.value, instance);
      } else {
        rootTree?.ctx.emit(
          'node-collapse',
          node.value.data,
          node.value,
          instance,
        );
      }
    },
  );

  /** 监听当前节点状态，发射 current-change 事件 */
  watch(
    () => node.value.isCurrent,
    (isCurrent) => {
      if (isCurrent) {
        rootTree?.ctx.emit(
          'current-change',
          node.value.data,
          node.value,
        );
      }
    },
  );

  /** 监听子节点数量变化，重新计算选中状态 */
  watch(
    () => node.value.childNodes.length,
    () => node.value.reInitChecked(),
  );

  /** 处理拖拽开始 */
  function handleDragStart(e: DragEvent) {
    if (!draggable.value) return;
    dragEvents.treeNodeDragStart({
      event: e,
      treeNode: { node: node.value, $el: nodeEl.value! },
    });
  }

  /** 处理拖拽经过 */
  function handleDragOver(e: DragEvent) {
    if (!draggable.value) return;
    dragEvents.treeNodeDragOver({
      event: e,
      treeNode: { node: node.value, $el: nodeEl.value! },
    });
  }

  /** 处理拖拽结束 */
  function handleDragEnd(e: DragEvent) {
    if (!draggable.value) return;
    dragEvents.treeNodeDragEnd(e);
  }

  return {
    rootTree,
    store,
    collapseSiblings,
    handleClick,
    handleContextmenu,
    expand,
    collapse,
    handleExpandIconClick,
    handleCheckChange,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
