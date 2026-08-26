<!-- ? Select 下拉菜单内容 -->
<template>
  <div :class="ns.b.value" @mousedown.prevent>
    <me-scrollbar :max-height="maxHeight">
      <div v-show="optionsCount > 0" :class="ns.e('list')">
        <slot></slot>
      </div>
    </me-scrollbar>
    <!-- 空状态 -->
    <div v-if="optionsCount === 0" :class="ns.e('empty')">
      <span>无数据</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MeScrollbar from '@me-ui/components/scrollbar';
import { useNamespace } from '@me-ui/hooks/use-namespace';

defineOptions({ name: 'MeSelectDropdown' });

defineProps({
  /** 过滤后的选项数量 */
  optionsCount: {
    type: Number,
    default: 0,
  },
  /** 下拉框最大高度 */
  maxHeight: {
    type: String,
    default: '',
  },
});

const ns = useNamespace('select-dropdown');
</script>
