<!-- ? MeScrollbar 滚动条组件使用示例 -->
<template>
  <div class="play-root">
    <h1>MeScrollbar 滚动条组件示例</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">固定高度的滚动区域，内容超出时显示自定义滚动条</p>
      <me-scrollbar height="200px">
        <div class="play-content">
          <p v-for="i in 20" :key="i">这是第 {{ i }} 行内容，用于演示垂直滚动效果。</p>
        </div>
      </me-scrollbar>
    </section>

    <!-- 最大高度 -->
    <section class="play-section">
      <h2>最大高度</h2>
      <p class="play-desc">内容不超过 maxHeight 时不出现滚动条，超过后自动出现</p>
      <me-scrollbar max-height="300px">
        <div class="play-content">
          <p v-for="i in dynamicCount" :key="i">动态内容第 {{ i }} 行。</p>
        </div>
      </me-scrollbar>
      <div class="play-actions">
        <me-button size="small" @click="dynamicCount = Math.max(1, dynamicCount - 5)">减少 5 行</me-button>
        <me-button size="small" @click="dynamicCount += 5">增加 5 行</me-button>
        <span class="play-label">当前行数：{{ dynamicCount }}</span>
      </div>
    </section>

    <!-- 始终显示 -->
    <section class="play-section">
      <h2>始终显示滚动条</h2>
      <p class="play-desc">设置 always 属性，滚动条始终可见</p>
      <me-scrollbar height="200px" always>
        <div class="play-content">
          <p v-for="i in 20" :key="i">always 模式第 {{ i }} 行。</p>
        </div>
      </me-scrollbar>
    </section>

    <!-- 原生滚动条 -->
    <section class="play-section">
      <h2>原生滚动条</h2>
      <p class="play-desc">设置 native 属性，使用浏览器原生滚动条</p>
      <me-scrollbar height="200px" native>
        <div class="play-content">
          <p v-for="i in 20" :key="i">native 模式第 {{ i }} 行。</p>
        </div>
      </me-scrollbar>
    </section>

    <!-- 水平滚动 -->
    <section class="play-section">
      <h2>水平 + 垂直滚动</h2>
      <p class="play-desc">内容宽度和高度均超出容器时，同时显示水平和垂直滚动条</p>
      <me-scrollbar height="200px">
        <div class="play-content-wide">
          <div class="play-content-inner">
            <p v-for="i in 15" :key="i">行 {{ i }} —— 这是一段较长的内容用于演示水平滚动效果，请向右滚动查看。</p>
          </div>
        </div>
      </me-scrollbar>
    </section>

    <!-- 自定义样式 -->
    <section class="play-section">
      <h2>自定义容器样式</h2>
      <p class="play-desc">通过 wrap-class / view-class 自定义容器样式</p>
      <me-scrollbar
        height="200px"
        wrap-class="play-custom-wrap"
        view-class="play-custom-view"
      >
        <div class="play-content">
          <p v-for="i in 20" :key="i">自定义样式第 {{ i }} 行。</p>
        </div>
      </me-scrollbar>
    </section>

    <!-- API 演示 -->
    <section class="play-section">
      <h2>API 演示</h2>
      <p class="play-desc">通过 ref 调用 setScrollTop / update 等方法</p>
      <div class="play-actions">
        <me-button size="small" @click="handleScrollToTop">滚动到顶部</me-button>
        <me-button size="small" @click="handleScrollToBottom">滚动到底部</me-button>
        <me-button size="small" @click="handleUpdate">手动更新</me-button>
        <span class="play-label">scrollTop: {{ scrollTopValue }}</span>
      </div>
      <me-scrollbar
        ref="apiScrollbarRef"
        height="200px"
        @scroll="onScrollEvent"
      >
        <div class="play-content">
          <p v-for="i in 30" :key="i">API 演示第 {{ i }} 行。</p>
        </div>
      </me-scrollbar>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type Scrollbar from '../src/components/scrollbar/Scrollbar.vue';

/** 动态行数 */
const dynamicCount = ref(10);

/** API 演示滚动条引用 */
const apiScrollbarRef = ref<InstanceType<typeof Scrollbar>>();

/** 当前 scrollTop 值 */
const scrollTopValue = ref(0);

/** 滚动事件 */
function onScrollEvent(scrollTop: number, scrollLeft: number) {
  scrollTopValue.value = Math.round(scrollTop);
}

/** 滚动到顶部 */
function handleScrollToTop() {
  apiScrollbarRef.value?.setScrollTop(0);
}

/** 滚动到底部 */
function handleScrollToBottom() {
  const wrap = apiScrollbarRef.value?.wrapRef;
  if (wrap) {
    apiScrollbarRef.value?.setScrollTop(wrap.scrollHeight);
  }
}

/** 手动更新滚动条 */
function handleUpdate() {
  apiScrollbarRef.value?.update();
}
</script>

<style lang="less" scoped>
.play-root {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 12px;
    color: #606266;
  }
}

.play-section {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.play-desc {
  margin-bottom: 12px;
  font-size: 13px;
  color: #909399;
}

.play-content {
  padding: 12px;

  p {
    margin: 0 0 12px;
    line-height: 1.6;
  }
}

.play-content-wide {
  width: 600px;
  padding: 12px;
}

.play-content-inner {
  width: 800px;

  p {
    margin: 0 0 12px;
    line-height: 1.6;
    white-space: nowrap;
  }
}

.play-actions {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  > * {
    margin-right: 12px;
  }
}

.play-label {
  font-size: 13px;
  color: #909399;
}
</style>

<style lang="less">
/* 自定义 wrap / view 样式（非 scoped） */
.play-custom-wrap {
  border: 2px dashed #409eff;
  border-radius: 6px;
}

.play-custom-view {
  padding: 16px;
  background-color: #f0f7ff;
}
</style>
