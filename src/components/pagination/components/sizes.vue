<!-- ? Pagination Sizes 每页条数选择器 -->
<template>
  <span :class="ns.e('sizes')">
    <me-select
      v-model="innerPageSize"
      :disabled="disabled"
      :options="sizeOptions"
      @change="onChange"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue';

import MeSelect from '@me-ui/components/select';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { mePaginationKey } from '../constants';
import { paginationSizesProps } from './sizes';
import type { OptionValue, SelectOption } from '@me-ui/components/select/types';

defineOptions({ name: 'MePaginationSizes' });

const props = defineProps(paginationSizesProps);

const ns = useNamespace('pagination');
const pagination = inject(mePaginationKey)!;

/** 内部每页条数 */
const innerPageSize = ref<number>(props.pageSize);

/** 监听 pageSize 变化，同步内部值 */
watch(
  () => props.pageSize,
  (val) => {
    innerPageSize.value = val;
  },
);

/** select 选项数据 */
const sizeOptions = computed<SelectOption[]>(() =>
  props.pageSizes.map((item) => ({
    value: item,
    label: `${item} 条/页`,
  })),
);

/** 值变化时同步通知父组件 */
function onChange(val: OptionValue | OptionValue[] | undefined) {
  if (typeof val === 'number') {
    pagination.handleSizeChange(val);
  }
}
</script>
