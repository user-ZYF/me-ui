<!-- Pagination Jumper 跳页 -->
<template>
  <span :class="ns.e('jump')">
    <span :class="ns.e('goto')">前往</span>
    <span :class="ns.e('editor')">
      <me-input
        v-model="innerValue"
        :min="1"
        :max="pageCount"
        :disabled="disabled"
        type="number"
        @change="handleChange"
      />
    </span>
    <span :class="ns.e('classifier')">页</span>
  </span>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue';

import MeInput from '@me-ui/components/input';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { mePaginationKey } from '../constants';

defineOptions({ name: 'MePaginationJumper' });

const ns = useNamespace('pagination');
const { pageCount, disabled, currentPage, handleCurrentChange } = inject(mePaginationKey)!;

/** 用户输入值 */
const userInput = ref<number | string | undefined>(undefined);

/** 输入框显示值 */
const innerValue = computed({
  get() {
    return userInput.value ?? currentPage.value;
  },
  set(val: number | string) {
    userInput.value = val ? +val : '';
  },
});

function handleChange(val: number | string) {
  // 去掉小数部分
  const page = Math.trunc(+val);
  handleCurrentChange(page);
  userInput.value = undefined;
}
</script>
