<!-- Pagination Total 总条目数 -->
<template>
  <span :class="ns.e('total')">
    共 {{ total }} 条
  </span>
</template>

<script lang="ts" setup>
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { paginationTotalProps } from './total';

defineOptions({ name: 'MePaginationTotal' });

defineProps(paginationTotalProps);

const ns = useNamespace('pagination');
</script>
