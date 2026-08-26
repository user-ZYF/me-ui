<!-- ? Select Option 选项组件 -->
<template>
  <div
    v-show="visible"
    :class="containerCls"
    @click.stop="onSelectClick"
  >
    <slot>
      <span>{{ label }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { optionProps } from './select';
import { selectKey } from './constants';
import type { OptionInstance } from './types';

defineOptions({ name: 'MeOption' });

const props = defineProps(optionProps);

const ns = useNamespace('select-dropdown');
const select = inject(selectKey);

if (!select) {
  throw new Error('MeOption must be used within MeSelect');
}

// 使用非空引用供闭包内使用，避免 TS narrowing 在闭包中失效
const selectCtx = select;

/** 当前标签 */
const label = computed(() => props.label || String(props.value));

/** 是否选中 */
const selected = computed(() => {
  const modelValue = selectCtx.modelValue.value;
  if (selectCtx.multiple.value) {
    return Array.isArray(modelValue) && modelValue.includes(props.value);
  }
  return modelValue === props.value;
});

/** 是否禁用 */
const disabled = computed(() => props.disabled);

/** 是否可见 */
const visible = ref(true);

/** 选项实例 */
const optionInstance: OptionInstance = {
  value: props.value,
  label,
  disabled,
  selected,
  visible,
};

/** 添加选项 */
selectCtx.addOption(optionInstance);

/** 移除选项 */
onBeforeUnmount(() => {
  selectCtx.removeOption(props.value);
});

/** 监听过滤查询，更新可见性 */
watch(
  () => selectCtx.filterQuery.value,
  (query) => {
    // IME 组合输入期间不更新可见性，避免选项闪烁
    if (selectCtx.isComposing.value) return;
    if (!query) {
      visible.value = true;
      return;
    }
    const customMethod = selectCtx.filterMethod.value;
    if (customMethod) {
      visible.value = customMethod(query, { value: props.value, label: label.value });
    } else {
      // 大小写不敏感的字符串匹配筛选
      visible.value = String(label.value).toLowerCase().includes(query.toLowerCase());
    }
  },
);

/** 点击选择 */
function onSelectClick() {
  if (!disabled.value) {
    selectCtx.selectOption(optionInstance);
  }
}

/** 容器类名 */
const containerCls = computed(() => [
  ns.e('item'),
  ns.is('disabled', disabled.value),
  ns.is('selected', selected.value),
]);
</script>
