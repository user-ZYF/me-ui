<!-- Tooltip 触发器组件，包裹默认插槽并绑定触发事件 -->
<template>
  <span ref="triggerRef" :class="ns.e('trigger')" @blur="onBlur" @click="onClick" @contextmenu="onContextMenu" @focus="onFocus" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <slot></slot>
  </span>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { TOOLTIP_INJECTION_KEY } from './constants';
import { composeEventHandlers } from './utils';

defineOptions({ name: 'MeTooltipTrigger' });

const ns = useNamespace('tooltip');

const { controlled, disabled, trigger, onOpen, onClose, onToggle } = inject(TOOLTIP_INJECTION_KEY)!;

/** 触发元素引用 */
const triggerRef = ref<HTMLElement>();

/** 受控或禁用时跳过 */
function stopWhenControlledOrDisabled() {
  if (controlled.value || disabled.value) {
    return true;
  }
}

const onMouseenter = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'hover',
  (e) => onOpen(e),
);

const onMouseleave = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'hover',
  (e) => onClose(e),
);

const onClick = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'click',
  (e) => {
    if ((e as MouseEvent).button === 0) {
      onToggle(e);
    }
  },
);

const onFocus = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'focus',
  (e) => onOpen(e),
);

const onBlur = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'focus',
  (e) => onClose(e),
);

const onContextMenu = composeEventHandlers(
  stopWhenControlledOrDisabled,
  trigger,
  'contextmenu',
  (e) => {
    e.preventDefault();
    onToggle(e);
  },
);

defineExpose({
  /** 触发元素引用 */
  triggerRef,
});
</script>
