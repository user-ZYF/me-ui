import { provide, ref } from "vue";

import { isFunction } from "@me-ui/utils/types";
import { useNamespace } from "@me-ui/hooks/use-namespace";

import type { InjectionKey, Ref } from "vue";
import type {
  AllowDragFunction,
  AllowDropFunction,
  NodeDropType,
  TreeEmitFn,
} from "../types";
import type TreeStore from "../model/tree-store";
import type Node from "../model/node";

/** 拖拽节点接口 */
export interface TreeNode {
  /** 节点 */
  node: Node;
  /** DOM 元素 */
  $el?: HTMLElement;
}

/** 拖拽选项 */
interface DragOptions {
  /** 事件 */
  event: DragEvent;
  /** 树节点 */
  treeNode: TreeNode;
}

/** Props 接口 */
interface Props {
  /** 属性 */
  props: {
    allowDrag?: AllowDragFunction;
    allowDrop?: AllowDropFunction;
  };
  /** 上下文 */
  ctx: { emit: TreeEmitFn };
  /** 容器元素引用 */
  container$: Ref<HTMLElement | null>;
  /** 放置指示器引用 */
  dropIndicator$: Ref<HTMLElement | null>;
  /** 树存储 */
  store: Ref<TreeStore>;
}

/** 拖拽事件接口 */
export interface DragEvents {
  /** 节点拖拽开始 */
  treeNodeDragStart: (options: DragOptions) => void;
  /** 节点拖拽经过 */
  treeNodeDragOver: (options: DragOptions) => void;
  /** 节点拖拽结束 */
  treeNodeDragEnd: (event: DragEvent) => void;
}

/** 拖拽状态 */
export interface DragState {
  /** 放置类型 */
  dropType: NodeDropType | null;
  /** 正在被拖拽节点 */
  draggingNode: TreeNode | null;
  /** 是否显示放置指示器 */
  showDropIndicator: boolean;
  /** 放置节点 */
  dropNode: TreeNode | null;
}

/** 拖拽事件注入 key */
export const dragEventsKey = Symbol("dragEvents") as InjectionKey<DragEvents>;

/** 拖拽节点处理 */
export function useDragNodeHandler({
  props,
  ctx,
  container$,
  dropIndicator$,
  store,
}: Props) {
  const ns = useNamespace("tree-node");
  /** 自动展开延迟（毫秒） */
  const AUTO_EXPAND_DELAY = 800;
  /** 自动展开定时器 */
  let autoExpandTimer: ReturnType<typeof setTimeout> | null = null;
  /** 清除自动展开定时器 */
  function clearAutoExpandTimer() {
    if (autoExpandTimer) {
      clearTimeout(autoExpandTimer);
      autoExpandTimer = null;
    }
  }
  /** 拖拽状态 */
  const dragState = ref<DragState>({
    showDropIndicator: false,
    draggingNode: null,
    dropNode: null,
    dropType: null,
  });

  /** 节点拖拽开始 */
  function treeNodeDragStart({ event, treeNode }: DragOptions) {
    if (isFunction(props.allowDrag) && !props.allowDrag(treeNode.node)) {
      // 阻止事件默认行为，不再生成拖拽预览
      event.preventDefault();
      return false;
    }
    event.dataTransfer!.effectAllowed = "move";

    dragState.value.draggingNode = treeNode;
    ctx.emit("node-drag-start", treeNode.node, event);
  }

  /** 节点拖拽经过 */
  function treeNodeDragOver({ event, treeNode }: DragOptions) {
    if (!event.dataTransfer) return;
    const dropNode = treeNode;
    const oldDropNode = dragState.value.dropNode;
    if (oldDropNode && oldDropNode.node.keyValue !== dropNode.node.keyValue) {
      oldDropNode.node.isDropInner = false;
    }
    const draggingNode = dragState.value.draggingNode;
    if (!draggingNode || !dropNode) return;

    let dropBefore = true;
    let dropInner = true;
    let dropAfter = true;
    if (isFunction(props.allowDrop)) {
      dropBefore = props.allowDrop(draggingNode.node, dropNode.node, "before");
      dropInner = props.allowDrop(
        draggingNode.node,
        dropNode.node,
        "inner",
      );
      dropAfter = props.allowDrop(draggingNode.node, dropNode.node, "after");
    }
    event.dataTransfer.dropEffect =
      dropInner || dropBefore || dropAfter ? "move" : "none";

    // 有效 dropNode：仅当允许放置时才视为当前 dropNode，
    const canDrop = dropBefore || dropInner || dropAfter;
    const newDropNode = canDrop ? dropNode : null;
    const oldNode = oldDropNode?.node;
    const newNode = newDropNode?.node;
    const dropNodeChanged = oldNode?.keyValue !== newNode?.keyValue;

    // 离开旧 dropNode（无论新节点是否可放置，只要切换了就要 leave）
    if (oldNode && dropNodeChanged) {
      ctx.emit("node-drag-leave", draggingNode.node, oldNode, event);
    }
    // 进入新 dropNode（仅当可放置且节点切换时）
    if (newNode && dropNodeChanged) {
      ctx.emit("node-drag-enter", draggingNode.node, newNode, event);
    }

    dragState.value.dropNode = newDropNode;

    if (dropNode.node.nextSibling === draggingNode.node) {
      dropAfter = false;
    }
    if (dropNode.node.previousSibling === draggingNode.node) {
      dropBefore = false;
    }
    if (dropNode.node.contains(draggingNode.node, false)) {
      dropInner = false;
    }
    if (
      draggingNode.node === dropNode.node ||
      draggingNode.node.contains(dropNode.node)
    ) {
      dropBefore = false;
      dropInner = false;
      dropAfter = false;
    }
    const dropEl = dropNode.$el!;

    const targetPosition = dropEl
      .querySelector(`.${ns.e("content")}`)!
      .getBoundingClientRect();
    const treePosition = container$.value!.getBoundingClientRect();
    const treeScrollTop = container$.value!.scrollTop;
    let dropType: NodeDropType;
    // 显示before指示器的区间百分比
    const beforePercent = dropBefore ? (dropInner ? 0.25 : dropAfter ? 0.5 : 1) : 0;
    // 显示after指示器的区间百分比
    const afterPercent = dropAfter ? (dropInner ? 0.25 : dropBefore ? 0.5 : 1) : 0;

    let indicatorTop = -9999;
    const distance = event.clientY - targetPosition.top;
    if (dropBefore && distance < targetPosition.height * beforePercent) {
      dropType = "before";
    } else if (
      dropAfter &&
      distance > targetPosition.height * (1 - afterPercent)
    ) {
      dropType = "after";
    } else if (dropInner) {
      dropType = "inner";
    } else {
      dropType = "none";
    }

    const labelPosition = dropEl
      .querySelector(`.${ns.e("label")}`)!
      .getBoundingClientRect();
    const dropIndicator = dropIndicator$.value;
    if (dropType === "before") {
      indicatorTop = targetPosition.top - treePosition.top + treeScrollTop;
    } else if (dropType === "after") {
      indicatorTop = targetPosition.bottom - treePosition.top + treeScrollTop;
    }
    if (dropIndicator) {
      dropIndicator.style.top = `${indicatorTop}px`;
      dropIndicator.style.left = `${labelPosition.left - treePosition.left}px`;
    }

    if (dropType === "inner") {
      dropNode.node.isDropInner = true;
    } else {
      dropNode.node.isDropInner = false;
    }

    /** 根据实际 dropType 处理自动展开 */
    if (dropType === "inner") {
      if (
        !autoExpandTimer &&
        !dropNode.node.isLeaf &&
        !dropNode.node.expanded &&
        !dropNode.node.contains(draggingNode.node)
      ) {
        autoExpandTimer = setTimeout(() => {
          dropNode.node.expand();
          clearAutoExpandTimer();
        }, AUTO_EXPAND_DELAY);
      }
    } else {
      clearAutoExpandTimer();
    }

    dragState.value.showDropIndicator =
      dropType === "before" || dropType === "after";
    dragState.value.dropType = dropType;
    if (newDropNode) {
      ctx.emit("node-drag-over", draggingNode.node, newDropNode.node, event);
    }
  }

  /** 节点拖拽结束 */
  function treeNodeDragEnd(event: DragEvent) {
    const { draggingNode, dropType, dropNode } = dragState.value;

    clearAutoExpandTimer();

    if (dropNode) {
      const draggingNodeData = draggingNode!.node.data;
      // 内联判断以收窄 dropType 类型为 Exclude<NodeDropType, 'none'>
      if (dropType && dropType !== "none") {
        /** 落库前按最终 dropType 再校验一次 allowDrop：dragover 阶段判定的是 before/inner/after 的并集，与最终落点类型可能不一致，且不允许时应避免内部模型被改动后与外部数据分叉 */
        const dropAllowed = isFunction(props.allowDrop)
          ? props.allowDrop(draggingNode!.node, dropNode.node, dropType)
          : true;
        if (dropAllowed) {
          draggingNode!.node.remove();
            if (dropType === "before") {
            dropNode.node.parent?.insertBefore(draggingNodeData, dropNode.node);
          } else if (dropType === "after") {
            dropNode.node.parent?.insertAfter(draggingNodeData, dropNode.node);
          } else if (dropType === "inner") {
            dropNode.node.insertChild(draggingNodeData);
          }

          const keyName = store.value.keyName;
          // 新节点已通过 insertChild -> initialize -> registerNode 注册，此处仅需同步选中状态
          if (keyName) {
            draggingNode!.node.eachNode((node) => {
              store.value.nodesMap[node.data[keyName]]?.setChecked(
                node.checkedState,
                !store.value.checkStrictly,
              );
            });
          }

          ctx.emit("node-drop", draggingNode!.node, dropNode.node, dropType, event);
        }
      }

      dropNode.node.isDropInner = false;
    }

    // node-drag-end 的 dropType 允许 'none'，用 ?? 兜底 null 初始值
    ctx.emit(
      "node-drag-end",
      draggingNode?.node ?? null,
      dropNode?.node ?? null,
      dropType ?? "none",
      event,
    );

    dragState.value.showDropIndicator = false;
    dragState.value.draggingNode = null;
    dragState.value.dropNode = null;
  }

  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
    treeNodeDragEnd,
  });

  return {
    dragState,
  };
}
