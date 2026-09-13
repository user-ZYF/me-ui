<!-- Pagination Pager 页码按钮 -->
<template>
  <ul :class="nsPager.b.value">
    <!-- 首页 -->
    <li
      v-if="pageCount > 0"
      :class="[
        'number',
        nsPager.is('active', currentPage === 1),
        nsPager.is('disabled', disabled),
      ]"
      @click="onPageClick(1)"
    >
      1
    </li>
    <!-- 向前省略 -->
    <li
      v-if="showPrev"
      :class="[
        'more',
        'btn-quickprev',
        nsIcon.b.value,
        nsPager.is('disabled', props.disabled)
      ]"
      @mouseenter="onMouseEnter(true)"
      @mouseleave="prevHover = false"
      @click="onPrevMoreClick"
    >
      <me-icon :size="12">
        <DArrowLeft v-if="prevHover && !disabled" />
        <MoreFilled v-else />
      </me-icon>
    </li>
    <!-- 页码列表 -->
    <li
      v-for="pager in pagers"
      :key="pager"
      :class="[
        'number',
        nsPager.is('active', currentPage === pager),
        nsPager.is('disabled', disabled),
      ]"
      @click="onPageClick(pager)"
    >
      {{ pager }}
    </li>
    <!-- 向后省略 -->
    <li
      v-if="showNext"
      :class="[
        'more',
        'btn-quicknext',
        nsIcon.b.value,
        nsPager.is('disabled', props.disabled)
      ]"
      @mouseenter="onMouseEnter()"
      @mouseleave="nextHover = false"
      @click="onNextMoreClick"
    >
      <me-icon :size="12">
        <DArrowRight v-if="nextHover && !disabled" />
        <MoreFilled v-else />
      </me-icon>
    </li>
    <!-- 尾页 -->
    <li
      v-if="pageCount > 1"
      :class="[
        'number',
        nsPager.is('active', currentPage === pageCount),
        nsPager.is('disabled', disabled),
      ]"
      @click="onPageClick(pageCount)"
    >
      {{ pageCount }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, inject, ref, watch } from "vue";

import { DArrowLeft, DArrowRight, MoreFilled } from "@element-plus/icons-vue";

import MeIcon from "@me-ui/components/icon";
import { useNamespace } from "@me-ui/hooks/use-namespace";

import { mePaginationKey } from "../constants";
import { paginationPagerProps } from "./pager";

defineOptions({ name: "MePaginationPager" });

const props = defineProps(paginationPagerProps);

const nsPager = useNamespace("pager");
const nsIcon = useNamespace("icon");
const pagination = inject(mePaginationKey)!;

/** 是否显示向前省略 */
const showPrev = ref(false);
/** 是否显示向后省略 */
const showNext = ref(false);
/** 向前省略 hover 状态 */
const prevHover = ref(false);
/** 向后省略 hover 状态 */
const nextHover = ref(false);

/** 计算向前/向后省略可见性 */
function getMoreState(pageCount: number, pagerCount: number, currentPage: number) {
  const halfPagerCount = (pagerCount - 1) / 2;
  let prevMore = false;
  let nextMore = false;

  if (pageCount > pagerCount) {
    prevMore = currentPage > pagerCount - halfPagerCount;
    nextMore = currentPage < pageCount - halfPagerCount;
  }

  return { prevMore, nextMore };
}

/** 计算页码列表 */
const pagers = computed(() => {
  const pagerCount = props.pagerCount;
  const currentPage = props.currentPage;
  const pageCount = props.pageCount;

  const { prevMore, nextMore } = getMoreState(pageCount, pagerCount, currentPage);

  const array: number[] = [];

  if (prevMore && !nextMore) {
    const startPage = pageCount - (pagerCount - 2);
    for (let i = startPage; i < pageCount; i++) {
      array.push(i);
    }
  } else if (!prevMore && nextMore) {
    for (let i = 2; i < pagerCount; i++) {
      array.push(i);
    }
  } else if (prevMore && nextMore) {
    const offset = Math.floor((pagerCount - 2) / 2);
    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
      array.push(i);
    }
  } else {
    for (let i = 2; i < pageCount; i++) {
      array.push(i);
    }
  }

  return array;
});

/** 监听页码变化，更新省略状态 */
watch(
  () => [props.pageCount, props.pagerCount, props.currentPage],
  ([pageCount, pagerCount, currentPage]) => {
    const { prevMore: prev, nextMore: next } = getMoreState(pageCount, pagerCount, currentPage);

    prevHover.value &&= prev;
    nextHover.value &&= next;
    showPrev.value = prev;
    showNext.value = next;
  },
  { immediate: true },
);

function onMouseEnter(forward = false) {
  if (props.disabled) return;
  if (forward) {
    prevHover.value = true;
  } else {
    nextHover.value = true;
  }
}

/** 页码点击 */
function onPageClick(page: number) {
  if (props.disabled || page === props.currentPage) return;
  pagination.handleCurrentChange(page);
}

/** 向前省略点击 */
function onPrevMoreClick() {
  if (props.disabled) return;
  const newPage = props.currentPage - (props.pagerCount - 2);
  pagination.handleCurrentChange(Math.max(1, newPage));
}

/** 向后省略点击 */
function onNextMoreClick() {
  if (props.disabled) return;
  const newPage = props.currentPage + (props.pagerCount - 2);
  pagination.handleCurrentChange(Math.min(props.pageCount, newPage));
}
</script>
