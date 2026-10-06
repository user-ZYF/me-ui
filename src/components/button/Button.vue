<!-- Button 按钮 -->
<template>
  <button
    :class="[
      ns.b.value,
      ns.m(type),
      ns.m(actualSize),
      ns.is('disabled', actualDisabled),
      ns.is('loading', loading),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('plain', plain),
    ]"
    :type="nativeType"
    :disabled="actualDisabled || loading"
    @click="onClick"
  >
    <!-- loading图标 -->
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading"></slot>
      <me-icon v-else :class="ns.e('loading-icon')" :size="14">
        <Loading />
      </me-icon>
    </template>
    <!-- 默认插槽，始终显示 -->
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Loading } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';
import { useFormItem, useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { buttonEmits, buttonProps } from './button';

defineOptions({ name: 'MeButton' });

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const ns = useNamespace('button');
const { form } = useFormItem();

/** 实际尺寸：优先使用 prop 传入的，其次继承 Form/FormItem 的，最后使用 ConfigProvider 的，最后使用默认值 */
const actualSize = useFormSize(computed(() => props.size));

/** 实际禁用状态：优先使用 prop 传入的，其次继承 Form 的 */
const actualDisabled = useFormDisabled(computed(() => props.disabled));

function onClick(evt: MouseEvent) {
  if (actualDisabled.value || props.loading) {
    evt.stopPropagation();
    return;
  }
  if (props.nativeType === 'reset') {
    form?.resetFormItems();
  }
  emit('click', evt);
}
</script>
