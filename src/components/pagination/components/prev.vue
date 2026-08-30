<!-- ? Pagination Prev 上一页 -->
<template>
  <button
    type="button"
    class="btn-prev"
    :disabled="isDisabled"
    @click="onClick"
  >
    <span v-if="prevText">{{ prevText }}</span>
    <me-icon v-else :size="12">
      <ArrowLeft />
    </me-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { ArrowLeft } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';

import { mePaginationKey } from '../constants';
import { paginationPrevProps } from './prev';

defineOptions({ name: 'MePaginationPrev' });

const props = defineProps(paginationPrevProps);

const pagination = inject(mePaginationKey)!;

/** 禁用状态：prop 禁用或已在首页 */
const isDisabled = computed(() => props.disabled || props.currentPage <= 1);

function onClick() {
  pagination.prev();
}
</script>
