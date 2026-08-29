<!-- ? Select 下拉菜单内容 -->
<template>
  <div :class="[ns.b.value, ns.is('multiple', multiple)]" @mousedown.prevent>
    <!-- 空状态 -->
    <div v-if="optionsCount === 0" :class="ns.e('empty')">
      <span>无数据</span>
    </div>
    <template v-else>
      <!-- 虚拟滚动 -->
      <me-virtual-list
        v-if="isVirtualMode"
        :data="options"
        :height="virtualListHeight"
        :item-height="itemHeight"
        item-key="value"
      >
        <template #default="{ item }">
          <div
            :class="[
              ns.e('item'),
              ns.is('disabled', !!item.disabled),
              ns.is('selected', isOptionSelected(item)),
            ]"
            :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }"
            @click.stop="onSelect(item)"
          >
            <slot name="option" :item="item">
              <span>{{ item.label }}</span>
            </slot>
          </div>
        </template>
      </me-virtual-list>
      <!-- 普通滚动 -->
      <me-scrollbar
        v-else
        :max-height="maxHeight"
      >
        <div
          v-for="item in options"
          :key="String(item.value)"
          :class="[
            ns.e('item'),
            ns.is('disabled', !!item.disabled),
            ns.is('selected', isOptionSelected(item)),
          ]"
          :style="{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }"
          @click.stop="onSelect(item)"
        >
          <slot name="option" :item="item">
            <span>{{ item.label }}</span>
          </slot>
        </div>
      </me-scrollbar>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import MeScrollbar from '@me-ui/components/scrollbar';
import MeVirtualList from '@me-ui/components/virtual-list';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { SELECT_DROPDOWN_NAMESPACE, selectKey } from './constants';
import { selectDropdownEmits, selectDropdownProps } from './select';
import type { SelectOption } from './types';

defineOptions({ name: 'MeSelectDropdown' });

const props = defineProps(selectDropdownProps);
const emit = defineEmits(selectDropdownEmits);

const ns = useNamespace(SELECT_DROPDOWN_NAMESPACE);

/** 注入 Select 上下文 */
const { modelValue } = inject(selectKey)!;

/** 虚拟列表实际高度（options 不足以撑满时收缩到内容高度） */
const virtualListHeight = computed(() => {
  const totalHeight = props.options.length * props.itemHeight;
  return Math.min(totalHeight, props.listHeight);
});

/** 判断选项是否选中 */
function isOptionSelected(option: SelectOption): boolean {
  const val = modelValue.value;
  if (props.multiple) {
    return Array.isArray(val) && val.includes(option.value);
  }
  return val === option.value;
}

/** 选择选项 */
function onSelect(option: SelectOption) {
  if (option.disabled) return;
  emit('select', option);
}
</script>
