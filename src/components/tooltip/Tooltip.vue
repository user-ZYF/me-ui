<!-- ? Tooltip 文字提示组件 -->
<template>
  <Trigger ref="triggerCompRef">
    <slot></slot>
  </Trigger>
  <Content ref="contentRef" :position="position">
    <slot name="content">
      <span>{{ content }}</span>
    </slot>
  </Content>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
  provide,
  readonly,
  ref,
  toRef,
  watch,
} from "vue";

import { useResizeObserver } from "@vueuse/core";

import { TOOLTIP_INJECTION_KEY } from "./constants";
import { addScrollSubscriber, removeScrollSubscriber } from "./use-scroll-subscriber";
import { tooltipEmits, tooltipProps } from "./tooltip";
import { usePopper } from "./use-popper";

import Content from "./Content.vue";
import Trigger from "./Trigger.vue";

defineOptions({ name: "MeTooltip" });

const props = defineProps(tooltipProps);
const emit = defineEmits(tooltipEmits);

/** v-model:visible 双向绑定 */
const visibleModel = defineModel<boolean | undefined>("visible", {
  default: undefined,
});

/** 是否打开 */
const open = ref(false);

/** 是否处于关闭过渡中 */
const isLeaving = ref(false);

/** 触发器组件引用 */
const triggerCompRef = ref<InstanceType<typeof Trigger>>();

/** 内容组件引用 */
const contentRef = ref<InstanceType<typeof Content>>();

/** 触发元素引用（从 Trigger 组件实例获取） */
const triggerRef = computed(() => triggerCompRef.value?.triggerRef);

/** 是否受外部控制 */
const controlled = computed(() => typeof visibleModel.value === "boolean");

/** 显示 */
function show(_e?: Event) {
  if (props.disabled) return;
  clearHideTimer();
  if (props.showAfter > 0) {
    showTimer = setTimeout(() => {
      doShow();
    }, props.showAfter);
  } else {
    doShow();
  }
}

/** 实际执行显示 */
function doShow() {
  if (controlled.value) {
    visibleModel.value = true;
  } else {
    open.value = true;
  }
}

/** 隐藏 */
function hide(_e?: Event) {
  clearShowTimer();
  if (props.hideAfter > 0) {
    hideTimer = setTimeout(() => {
      doHide();
    }, props.hideAfter);
  } else {
    doHide();
  }
}

/** 实际执行隐藏 */
function doHide() {
  if (controlled.value) {
    visibleModel.value = false;
  } else {
    open.value = false;
  }
}

/** 显示延迟定时器 */
let showTimer: ReturnType<typeof setTimeout> | undefined;
/** 隐藏延迟定时器 */
let hideTimer: ReturnType<typeof setTimeout> | undefined;

/** 清除显示定时器 */
function clearShowTimer() {
  if (showTimer !== undefined) {
    clearTimeout(showTimer);
    showTimer = undefined;
  }
}

/** 清除隐藏定时器 */
function clearHideTimer() {
  if (hideTimer !== undefined) {
    clearTimeout(hideTimer);
    hideTimer = undefined;
  }
}

/** 弹出层元素引用 */
const popperRef = computed(() => contentRef.value?.popperRef);

/** 定位 */
const { position, updatePopper } = usePopper(
  triggerRef as any,
  popperRef as any,
  toRef(props, "placement"),
);

provide(TOOLTIP_INJECTION_KEY, {
  controlled,
  open: readonly(open),
  disabled: toRef(props, "disabled"),
  trigger: toRef(props, "trigger"),
  placement: toRef(props, "placement"),
  effect: toRef(props, "effect"),
  zIndex: toRef(props, "zIndex"),
  popperClass: toRef(props, "popperClass"),
  transition: toRef(props, "transition"),
  onOpen: show,
  onClose: hide,
  onToggle: (e: Event) => {
    const isOpen = controlled.value ? visibleModel.value : open.value;
    if (isOpen) {
      hide(e);
    } else {
      show(e);
    }
  },
  onBeforeShow: () => emit("beforeShow"),
  onBeforeHide: () => emit("beforeHide"),
  onShow: () => emit("show"),
  onHide: () => {
    emit("hide");
    isLeaving.value = false;
    // 完全隐藏后才删除事件监听
    removeScrollSubscriber(onScrollUpdate);
  },
  updatePopper,
});

/** 监听 disabled 变化 */
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      clearShowTimer();
      clearHideTimer();
      if (controlled.value) {
        visibleModel.value = false;
      } else {
        open.value = false;
      }
    }
  },
);

/** 监听 visible 受控变化 */
watch(
  visibleModel,
  (val) => {
    if (typeof val === "boolean") {
      open.value = val;
    }
  },
  { immediate: true },
);

/** 监听 open 变化，更新位置 */
watch(
  open,
  (val) => {
    if (val) {
      isLeaving.value = false;
      addScrollSubscriber(onScrollUpdate);
      // nextTick能确保弹出层容器的display不再为none，之后才能获取到尺寸信息
      nextTick(() => {
        updatePopper();
      });
    } else {
      isLeaving.value = true;
    }
  },
  // { flush: "post" }, // ❌️
);

/** 监听 placement 变化，打开状态下自动更新位置 */
watch(
  () => props.placement,
  () => {
    if (open.value) {
      updatePopper();
    }
  },
);

/** scroll/resize 回调：弹出层不可见时跳过 */
function onScrollUpdate() {
  if (!open.value && !isLeaving.value) return;
  updatePopper();
}

/** trigger 尺寸变化回调：tooltip 未打开时跳过 */
function onTriggerResize() {
  if (!open.value) return;
  updatePopper();
}

// ResizeObserver 保证每帧最多触发一次回调
useResizeObserver(triggerRef, onTriggerResize);

onDeactivated(() => {
  clearShowTimer();
  clearHideTimer();
  doHide();
  removeScrollSubscriber(onScrollUpdate);
});

onBeforeUnmount(() => {
  clearShowTimer();
  clearHideTimer();
  removeScrollSubscriber(onScrollUpdate);
});

defineExpose({
  /** 更新弹出层位置 */
  updatePopper,
  /** 打开 */
  show,
  /** 关闭 */
  hide,
  /** 判断焦点是否在弹出层内部 */
  isFocusInsideContent: (event?: FocusEvent) =>
    contentRef.value?.isFocusInsideContent(event),
});
</script>
