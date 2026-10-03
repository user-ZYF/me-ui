import { markRaw, provide, ref } from "vue";

import { isFunction } from "@me-ui/utils/types";
import { useNamespace } from "@me-ui/hooks/use-namespace";

import {
  entityContains,
  getNextSibling,
  getPreviousSibling,
} from "../utils/treeUtil";

import type { ComputedRef, InjectionKey, Ref } from "vue";
import type {
  AllowDragFunction,
  AllowDropFunction,
  DataEntity,
  DragState,
  DragTreeNode,
  NodeDropType,
  TreeEmitFn,
  TreeEventNode,
  TreeKey,
} from "../types";

export type { DragState, DragTreeNode } from "../types";

/** 拖拽选项 */
interface DragOptions {
  /** 事件 */
  event: DragEvent;
  /** 树节点实体 */
  treeNode: DragTreeNode;
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
  /** key → 实体（拖拽期间实体图可能重建，使用时需按 key 重新解析） */
  keyEntities: ComputedRef<Map<TreeKey, DataEntity>>;
  /** 创建事件节点（事件载荷与 allowDrag / allowDrop 入参） */
  createEventNode: (entity: DataEntity) => TreeEventNode;
  /** 实体是否叶子（自动展开前置判断） */
  isLeafEntity: (entity: DataEntity) => boolean;
  /** 展开 key 集合（自动展开前置判断） */
  expandedKeysSet: ComputedRef<Set<TreeKey>>;
  /** 展开实体（拖拽悬停自动展开，含手风琴收拢与懒加载等待） */
  onNodeExpand: (entity: DataEntity) => void;
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

/** 拖拽事件注入 key */
export const dragEventsKey = Symbol("dragEvents") as InjectionKey<DragEvents>;

/** 拖拽节点处理 */
export function useDragNodeHandler({
  props,
  ctx,
  container$,
  dropIndicator$,
  keyEntities,
  createEventNode,
  isLeafEntity,
  expandedKeysSet,
  onNodeExpand,
}: Props) {
  const ns = useNamespace("tree-node");
  /** 拖拽状态 */
  const dragState = ref<DragState>({
    dropType: "none",
    draggingNode: null,
    dropNode: null,
    showDropIndicator: false,
  });

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

  /** 获取最新实体：实体图可能已重建，按 key 取当前实体，取不到视为已失效 */
  function getCurrentEntity(entity: DataEntity): DataEntity | null {
    return keyEntities.value.get(entity.key) ?? null;
  }

  /** 复位放置状态（放置节点、dropType、指示器、自动展开定时器） */
  function resetDropState() {
    clearAutoExpandTimer();
    dragState.value.dropNode = null;
    dragState.value.dropType = "none";
    dragState.value.showDropIndicator = false;
  }

  /** 节点拖拽开始 */
  function treeNodeDragStart({ event, treeNode }: DragOptions) {
    const entity = getCurrentEntity(treeNode.node);
    if (!entity) {
      event.preventDefault();
      return false;
    }
    const eventNode = createEventNode(entity);
    if (isFunction(props.allowDrag) && !props.allowDrag(eventNode)) {
      // 阻止事件默认行为，不再生成拖拽预览
      event.preventDefault();
      return false;
    }
    // 设置拖拽时的光标状态
    event.dataTransfer!.effectAllowed = "move";

    // markRaw 防止实体被响应式代理（避免后续拿到的draggingNode是代理过的对象，reactive(obj) !== obj）
    dragState.value.draggingNode = markRaw(treeNode);
    ctx.emit("node-drag-start", eventNode, event);
  }

  /** 节点拖拽经过 */
  function treeNodeDragOver({ event, treeNode }: DragOptions) {
    if (!event.dataTransfer) return;
    const dropNode = markRaw(treeNode);
    const oldDropNode = dragState.value.dropNode;
    const draggingNode = dragState.value.draggingNode;
    if (!draggingNode || !dropNode) return;
    // 实体图可能已重建（拖拽中途自动展开触发懒加载），按 key 取当前实体
    const draggingEntity = getCurrentEntity(draggingNode.node);
    const dropEntity = getCurrentEntity(dropNode.node);
    if (!draggingEntity || !dropEntity) return;

    const draggingEventNode = createEventNode(draggingEntity);
    const dropEventNode = createEventNode(dropEntity);

    let canDropBefore = true;
    let canDropInner = true;
    let canDropAfter = true;
    if (isFunction(props.allowDrop)) {
      canDropBefore = props.allowDrop(draggingEventNode, dropEventNode, "before");
      canDropInner = props.allowDrop(draggingEventNode, dropEventNode, "inner");
      canDropAfter = props.allowDrop(draggingEventNode, dropEventNode, "after");
    }
    // 结构性限制先于 canDrop 判定：自身/自身后代/相邻原位不可放置
    if (getNextSibling(dropEntity) === draggingEntity) {
      canDropAfter = false;
    }
    if (getPreviousSibling(dropEntity) === draggingEntity) {
      canDropBefore = false;
    }
    if (entityContains(dropEntity, draggingEntity, false)) {
      canDropInner = false;
    }
    if (
      // markRaw 的作用就是避免这里判断出问题
      draggingEntity === dropEntity ||
      entityContains(draggingEntity, dropEntity)
    ) {
      canDropBefore = false;
      canDropInner = false;
      canDropAfter = false;
    }
    // 有效 dropNode：仅当允许放置时才视为当前 dropNode
    const canDrop = canDropBefore || canDropInner || canDropAfter;

    // 设置拖拽节点悬停在当前节点上时，光标的状态
    event.dataTransfer.dropEffect = canDrop ? "move" : "none";
    const newDropNode = canDrop
      ? markRaw({ node: dropEntity, $el: treeNode.$el })
      : null;
    const oldEntity = oldDropNode ? getCurrentEntity(oldDropNode.node) : null;

    // 离开旧 dropNode（切换到不可放置或其他节点时）
    if (oldEntity && (!newDropNode || oldEntity.key !== dropEntity.key)) {
      ctx.emit(
        "node-drag-leave",
        draggingEventNode,
        createEventNode(oldEntity),
        event,
      );
    }
    // 进入新 dropNode（仅当可放置且节点切换时）
    if (newDropNode && oldEntity?.key !== dropEntity.key) {
      ctx.emit(
        "node-drag-enter",
        draggingEventNode,
        dropEventNode,
        event,
      );
    }

    dragState.value.dropNode = newDropNode;

    const dropEl = dropNode.$el;
    const contentEl = dropEl?.querySelector<HTMLElement>(
      `.${ns.e("content")}`,
    );
    if (!contentEl) return;
    const contentRect = contentEl.getBoundingClientRect();
    const treeRect = container$.value!.getBoundingClientRect();
    let dropType: NodeDropType;
    // 显示before指示器的区间百分比
    const beforePercent = canDropBefore
      ? canDropInner
        ? 0.25
        : canDropAfter
          ? 0.5
          : 1
      : 0;
    // 显示after指示器的区间百分比
    const afterPercent = canDropAfter
      ? canDropInner
        ? 0.25
        : canDropBefore
          ? 0.5
          : 1
      : 0;

    let indicatorTop = -9999;
    const distance = event.clientY - contentRect.top;
    if (canDropBefore && distance < contentRect.height * beforePercent) {
      dropType = "before";
    } else if (
      canDropAfter &&
      distance > contentRect.height * (1 - afterPercent)
    ) {
      dropType = "after";
    } else if (canDropInner) {
      dropType = "inner";
    } else {
      dropType = "none";
    }

    // 指示器在不滚动的容器内定位，两个矩形均为视口坐标，直接相减即可
    const labelEl = dropEl?.querySelector<HTMLElement>(`.${ns.e("label")}`);
    const labelRect = labelEl?.getBoundingClientRect();
    const dropIndicator = dropIndicator$.value;
    if (dropType === "before") {
      indicatorTop = contentRect.top - treeRect.top;
    } else if (dropType === "after") {
      indicatorTop = contentRect.bottom - treeRect.top;
    }
    if (dropIndicator) {
      dropIndicator.style.top = `${indicatorTop}px`;
      dropIndicator.style.left = `${(labelRect?.left ?? contentRect.left) - treeRect.left}px`;
    }

    /** 根据实际 dropType 处理自动展开 */
    if (dropType === "inner") {
      if (
        !autoExpandTimer &&
        !isLeafEntity(dropEntity) &&
        !expandedKeysSet.value.has(dropEntity.key) &&
        !entityContains(dropEntity, draggingEntity)
      ) {
        autoExpandTimer = setTimeout(() => {
          // 展开函数内部已处理手风琴收拢与懒加载等待
          const current = getCurrentEntity(dropEntity);
          if (current) onNodeExpand(current);
          clearAutoExpandTimer();
        }, AUTO_EXPAND_DELAY);
      }
    } else {
      clearAutoExpandTimer();
    }

    dragState.value.showDropIndicator = dropType === "before" || dropType === "after";
    dragState.value.dropType = dropType;
    if (newDropNode) {
      ctx.emit(
        "node-drag-over",
        draggingEventNode,
        dropEventNode,
        event,
      );
    }
  }

  /** 容器拖拽经过：悬停离开节点区域时复位放置状态 */
  function treeContainerDragOver(event: DragEvent) {
    const { draggingNode, dropNode } = dragState.value;
    if (!draggingNode || !dropNode) return;
    const draggingEntity = getCurrentEntity(draggingNode.node);
    const dropEntity = getCurrentEntity(dropNode.node);
    if (draggingEntity && dropEntity) {
      ctx.emit(
        "node-drag-leave",
        createEventNode(draggingEntity),
        createEventNode(dropEntity),
        event,
      );
    }
    resetDropState();
  }

  /** 容器拖拽离开：移出树区域时复位放置状态 */
  function treeContainerDragLeave(event: DragEvent) {
    // 仅 target 为容器时才是真的移出树区域
    if (event.target !== container$.value) return;
    treeContainerDragOver(event);
  }

  /** 节点拖拽结束 */
  function treeNodeDragEnd(event: DragEvent) {
    const { draggingNode, dropType, dropNode } = dragState.value;

    clearAutoExpandTimer();

    const draggingEntity = draggingNode
      ? getCurrentEntity(draggingNode.node)
      : null;
    const dropEntity = dropNode ? getCurrentEntity(dropNode.node) : null;

    const draggingEventNode = draggingEntity
      ? createEventNode(draggingEntity)
      : null;
    const dropEventNode = dropEntity ? createEventNode(dropEntity) : null;

    // 不修改树结构，仅抛出 node-drop 事件，
    if (dropEventNode && draggingEventNode && dropType !== "none") {
      ctx.emit(
        "node-drop",
        draggingEventNode,
        dropEventNode,
        dropType,
        event,
      );
    }

    ctx.emit(
      "node-drag-end",
      draggingEventNode,
      dropEventNode,
      dropType,
      event,
    );

    resetDropState();
    dragState.value.draggingNode = null;
  }

  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
    treeNodeDragEnd,
  });

  return {
    dragState,
    onContainerDragOver: treeContainerDragOver,
    onContainerDragLeave: treeContainerDragLeave,
  };
}
