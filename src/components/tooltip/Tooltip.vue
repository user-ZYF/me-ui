<!-- ? Tooltip 文字提示组件 -->
<template>
  <Trigger ref="triggerCompRef">
    <slot></slot>
  </Trigger>
  <Content
    ref="contentRef"
    :position="position"
  >
    <slot name="content">
      <span>{{ content }}</span>
    </slot>
  </Content>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onDeactivated, onMounted, provide, readonly, ref, toRef, watch } from 'vue';

import { TOOLTIP_INJECTION_KEY } from './constants';
import { tooltipEmits, tooltipProps } from './tooltip';
import { usePopper } from './use-popper';

import Content from './Content.vue';
import Trigger from './Trigger.vue';

defineOptions({ name: 'MeTooltip' });

const props = defineProps(tooltipProps);
const emit = defineEmits(tooltipEmits);

/** v-model:visible 双向绑定 */
const visibleModel = defineModel<boolean | undefined>('visible', {
  default: undefined
});

/** 是否打开 */
const open = ref(false);

/** 触发器组件引用 */
const triggerCompRef = ref<InstanceType<typeof Trigger>>();

/** 内容组件引用 */
const contentRef = ref<InstanceType<typeof Content>>();

/** 触发元素引用（从 Trigger 组件实例获取） */
const triggerRef = computed(() => triggerCompRef.value?.triggerRef);

/** 是否受外部控制 */
const controlled = computed(() => typeof visibleModel.value === 'boolean');

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
  toRef(props, 'placement'),
);

provide(TOOLTIP_INJECTION_KEY, {
  controlled,
  open: readonly(open),
  disabled: toRef(props, 'disabled'),
  trigger: toRef(props, 'trigger'),
  placement: toRef(props, 'placement'),
  effect: toRef(props, 'effect'),
  zIndex: toRef(props, 'zIndex'),
  popperClass: toRef(props, 'popperClass'),
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
  onBeforeShow: () => emit('beforeShow'),
  onBeforeHide: () => emit('beforeHide'),
  onShow: () => emit('show'),
  onHide: () => emit('hide'),
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
watch(visibleModel, (val) => {
  if (typeof val === 'boolean') {
    open.value = val;
  }
}, { immediate: true });

/** 监听 open 变化，更新位置 */
watch(
  open,
  (val) => {
    if (val) {
      // 等待两帧确保 v-show 切换后 DOM 布局完成
      requestAnimationFrame(() => {
          updatePopper();
      });
    }
  },
  { flush: 'post' },
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

/** 监听窗口滚动和 resize，更新位置（rAF 节流） */
let scrollRafId: number | undefined;

function onScroll() {
  if (!open.value) return;
  if (scrollRafId !== undefined) cancelAnimationFrame(scrollRafId);
  scrollRafId = requestAnimationFrame(() => {
    updatePopper();
    scrollRafId = undefined;
  });
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
});

onDeactivated(() => {
  clearShowTimer();
  clearHideTimer();
  if (open.value) {
    hide();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll, true);
  window.removeEventListener('resize', onScroll);
  if (scrollRafId !== undefined) cancelAnimationFrame(scrollRafId);
  clearShowTimer();
  clearHideTimer();
});

defineExpose({
  /** 更新弹出层位置 */
  updatePopper,
  /** 打开 */
  show,
  /** 关闭 */
  hide,
});
</script>
