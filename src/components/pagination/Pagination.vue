<!-- ? Pagination 分页 -->
<template>
  <div v-if="showPagination" :class="[ns.b.value, ns.is('background', props.background)]">
    <component
      v-for="key in leftComps"
      :key="key"
      :is="componentMap[key]"
      v-bind="getComponentProps(key)"
    />
    <div v-if="hasRightWrapper" :class="ns.e('rightwrapper')">
      <component
        v-for="key in rightComps"
        :key="key"
        :is="componentMap[key]"
        v-bind="getComponentProps(key)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { componentMap, mePaginationKey } from './constants';
import { paginationEmits, paginationProps } from './pagination';
import type { PaginationLayoutComponentKey, PaginationLayoutKey } from './pagination';
import type { PaginationNextProps } from './components/next';
import type { PaginationPagerProps } from './components/pager';
import type { PaginationPrevProps } from './components/prev';
import type { PaginationSizesProps } from './components/sizes';
import type { PaginationTotalProps } from './components/total';

defineOptions({ name: 'MePagination' });

const props = defineProps(paginationProps);
const emit = defineEmits(paginationEmits);

/** 当前页码 */
const currentPageModel = defineModel<number>('currentPage', { required: true });
/** 每页条数 */
const pageSizeModel = defineModel<number>('pageSize', { required: true });

const ns = useNamespace('pagination');

/** 总页数 */
const pageCount = computed<number>(() => {
  // 优先使用 pageCount prop
  if (props.pageCount !== undefined) {
    return props.pageCount;
  }
  // 其次通过 total/pageSize 计算
  if (props.total !== undefined) {
    return Math.max(1, Math.ceil(props.total / Math.max(1, pageSizeModel.value)));
  }
  // 防御性兜底
  return 1;
});

/** 当前页码 */
const currentPage = computed<number>({
  get() {
    return currentPageModel.value;
  },
  set(val: number) {
    let newPage = val;
    if (val < 1) {
      newPage = 1;
    } else if (val > pageCount.value) {
      newPage = pageCount.value;
    }
    if (newPage === currentPageModel.value) return;
    currentPageModel.value = newPage;
    emit('current-change', newPage);
  },
});

/** 监听总页数变化，修正当前页 */
watch(pageCount, (val) => {
  if (currentPage.value > val) {
    currentPage.value = val;
  }
});

/** 处理页码变化 */
function handleCurrentChange(val: number) {
  currentPage.value = val;
}

/** 上一页 */
function prev() {
  if (props.disabled || currentPage.value <= 1) return;
  currentPage.value -= 1;
  emit('prev-click', currentPage.value);
}

/** 下一页 */
function next() {
  if (props.disabled || currentPage.value >= pageCount.value) return;
  currentPage.value += 1;
  emit('next-click', currentPage.value);
}

/** 处理每页条数变化 */
function handleSizeChange(val: number) {
  pageSizeModel.value = val;
  emit('size-change', val);
}

/** 注入上下文 */
provide(mePaginationKey, {
  pageCount: pageCount,
  disabled: computed(() => props.disabled),
  currentPage: currentPage,
  handleCurrentChange,
  handleSizeChange,
  prev,
  next,
});

/** 解析布局字符串 */
const parsedLayout = computed(() => {
  const items = props.layout.split(',').map((item) => item.trim() as PaginationLayoutKey);
  const rightIndex = items.indexOf('->');

  if (rightIndex === -1) {
    return {
      left: items as PaginationLayoutComponentKey[],
      right: [] as PaginationLayoutComponentKey[],
    };
  }

  return {
    left: items.slice(0, rightIndex) as PaginationLayoutComponentKey[],
    right: items.slice(rightIndex + 1) as PaginationLayoutComponentKey[],
  };
});

/** 是否显示分页 */
const showPagination = computed(() => !(props.hideOnSinglePage && pageCount.value <= 1));

/** 左侧布局组件 */
const leftComps = computed(() => parsedLayout.value.left);

/** 右侧布局组件 */
const rightComps = computed(() => parsedLayout.value.right);

/** 是否有右侧容器 */
const hasRightWrapper = computed(() => rightComps.value.length > 0);

/** 获取组件 props */
function getComponentProps(key: PaginationLayoutComponentKey) {
  switch (key) {
    // 上一页按钮
    case 'prev':
      return {
        disabled: props.disabled,
        currentPage: currentPage.value,
        prevText: props.prevText,
      } as PaginationPrevProps;
    // 下一页按钮
    case 'next':
      return {
        disabled: props.disabled,
        currentPage: currentPage.value,
        pageCount: pageCount.value,
        nextText: props.nextText,
      } as PaginationNextProps;
    // 分页按钮组
    case 'pager':
      return {
        currentPage: currentPage.value,
        pageCount: pageCount.value,
        pagerCount: props.pagerCount,
        disabled: props.disabled,
      } as PaginationPagerProps;
    // 总条数
    case 'total':
      return { total: props.total } as PaginationTotalProps;
    // 跳转输入框
    case 'jumper':
      return {};
    // 每页条数选择器
    case 'sizes':
      return {
        pageSize: pageSizeModel.value,
        pageSizes: props.pageSizes,
        disabled: props.disabled,
      } as PaginationSizesProps;
    default:
      return {};
  }
}
</script>
