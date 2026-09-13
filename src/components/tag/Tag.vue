<!-- Tag 标签组件 -->
<template>
  <span
    :class="containerKls"
    @click="onClick"
  >
    <span :class="ns.e('content')">
      <slot></slot>
    </span>
    <button
      v-if="closable"
      :class="ns.e('close')"
      type="button"
      @click.stop="onClose"
    >
      <me-icon :size="iconSize">
        <Close />
      </me-icon>
    </button>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Close } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';
import { useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { tagEmits, tagProps } from './tag';

defineOptions({ name: 'MeTag' });

const props = defineProps(tagProps);
const emit = defineEmits(tagEmits);

const ns = useNamespace('tag');

/** 实际尺寸：优先使用 prop 传入的，其次继承 Form/FormItem 的，最后使用默认值 */
const tagSize = useFormSize(computed(() => props.size));

/** 关闭图标尺寸 */
const iconSize = computed(() => {
  if (tagSize.value === 'large') return 16;
  if (tagSize.value === 'small') return 12;
  return 14;
});

/** 容器类名 */
const containerKls = computed(() => [
  ns.b.value,
  ns.is('closable', props.closable),
  ns.m(props.type),
  ns.m(tagSize.value),
  ns.m(props.effect),
]);

/** 关闭 */
function onClose(evt: MouseEvent) {
  emit('close', evt);
}

/** 点击 */
function onClick(evt: MouseEvent) {
  emit('click', evt);
}
</script>
