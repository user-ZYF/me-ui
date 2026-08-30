<!-- ? Pagination Next 下一页 -->
<template>
  <button
    type="button"
    class="btn-next"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <me-icon v-else :size="12">
      <ArrowRight />
    </me-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { ArrowRight } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';

import { mePaginationKey } from '../constants';
import { paginationNextProps } from './next';

defineOptions({ name: 'MePaginationNext' });

const props = defineProps(paginationNextProps);

const pagination = inject(mePaginationKey)!;

/** 禁用状态：prop 禁用或已在尾页 */
const isDisabled = computed(
  () => props.disabled || props.currentPage === props.pageCount || props.pageCount === 0,
);

function onClick() {
  pagination.next();
}
</script>
