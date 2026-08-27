<!-- ? Scrollbar 滚动条组件示例 -->
<template>
  <div class="play-scrollbar">
    <h1>MeScrollbar 滚动条</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">固定高度 300px，内容超出时出现自定义滚动条</p>
      <div class="play-border">
        <me-scrollbar :height="300">
          <div
            v-for="i in 50"
            :key="i"
            class="play-item"
            :class="{ 'is-odd': i % 2 === 1 }"
          >
            <span class="play-item-index">#{{ String(i).padStart(3, '0') }}</span>
            <span class="play-item-label">这是第 {{ i }} 条内容</span>
          </div>
        </me-scrollbar>
      </div>
    </section>

    <!-- 最大高度 -->
    <section class="play-section">
      <h2>最大高度（maxHeight）</h2>
      <p class="play-desc">内容不超过 maxHeight 时自适应撑开，超过后锁定高度并出现滚动条</p>
      <div class="play-border">
        <me-scrollbar :max-height="300">
          <div
            v-for="i in 20"
            :key="i"
            class="play-item"
            :class="{ 'is-odd': i % 2 === 1 }"
          >
            <span class="play-item-index">#{{ String(i).padStart(3, '0') }}</span>
            <span class="play-item-label">这是第 {{ i }} 条内容</span>
          </div>
        </me-scrollbar>
      </div>
    </section>

    <!-- 水平滚动 -->
    <section class="play-section">
      <h2>水平滚动</h2>
      <p class="play-desc">内容宽度超出容器时出现水平滚动条</p>
      <div class="play-border">
        <me-scrollbar :height="120">
          <div class="play-horizontal-content">
            <div
              v-for="i in 20"
              :key="i"
              class="play-horizontal-card"
            >
              卡片 {{ i }}
            </div>
          </div>
        </me-scrollbar>
      </div>
    </section>

    <!-- setScrollTop 平滑滚动 -->
    <section class="play-section">
      <h2>setScrollTop / setScrollLeft（平滑滚动）</h2>
      <p class="play-desc">
        通过 ref 调用 setScrollTop / setScrollLeft 方法，第二参数 smooth 控制是否平滑滚动<br />
        smooth = false（默认）：瞬间跳转 | smooth = true：原生 behavior: 'smooth' 平滑滚动
      </p>
      <div class="play-controls">
        <me-button size="small" @click="handleScrollTop(0, false)">scrollTop → 0（瞬间）</me-button>
        <me-button size="small" @click="handleScrollTop(500, false)">scrollTop → 500（瞬间）</me-button>
        <me-button size="small" @click="handleScrollTop(1000, false)">scrollTop → 1000（瞬间）</me-button>
        <me-button size="small" @click="handleScrollTop(0, true)">scrollTop → 0（平滑）</me-button>
        <me-button size="small" @click="handleScrollTop(500, true)">scrollTop → 500（平滑）</me-button>
        <me-button size="small" @click="handleScrollTop(1000, true)">scrollTop → 1000（平滑）</me-button>
      </div>
      <div class="play-controls">
        <me-button size="small" @click="handleScrollLeft(0, false)">scrollLeft → 0（瞬间）</me-button>
        <me-button size="small" @click="handleScrollLeft(300, false)">scrollLeft → 300（瞬间）</me-button>
        <me-button size="small" @click="handleScrollLeft(0, true)">scrollLeft → 0（平滑）</me-button>
        <me-button size="small" @click="handleScrollLeft(300, true)">scrollLeft → 300（平滑）</me-button>
      </div>
      <div class="play-border">
        <me-scrollbar
          ref="scrollDemoRef"
          :height="300"
          @scroll="onScrollEvent"
        >
          <div class="play-horizontal-content" style="width: 1600px;">
            <div
              v-for="i in 80"
              :key="i"
              class="play-item"
              :class="{ 'is-odd': i % 2 === 1 }"
            >
              <span class="play-item-index">#{{ String(i).padStart(3, '0') }}</span>
              <span class="play-item-label">这是第 {{ i }} 条内容，宽度超出容器以演示水平滚动</span>
            </div>
          </div>
        </me-scrollbar>
      </div>
      <p class="play-label">当前 scrollTop：{{ currentScrollTop }}px | scrollLeft：{{ currentScrollLeft }}px</p>
    </section>

    <!-- scroll 事件 -->
    <section class="play-section">
      <h2>scroll 事件监听</h2>
      <p class="play-desc">滚动时触发 scroll 事件，回调参数为 (scrollTop, scrollLeft)</p>
      <div class="play-border">
        <me-scrollbar
          :height="250"
          @scroll="onScrollEvent2"
        >
          <div
            v-for="i in 40"
            :key="i"
            class="play-item"
            :class="{ 'is-odd': i % 2 === 1 }"
          >
            <span class="play-item-index">#{{ String(i).padStart(3, '0') }}</span>
            <span class="play-item-label">这是第 {{ i }} 条内容</span>
          </div>
        </me-scrollbar>
      </div>
      <p class="play-label">scrollTop：{{ eventScrollTop }}px | scrollLeft：{{ eventScrollLeft }}px</p>
    </section>

    <!-- update 手动更新 -->
    <section class="play-section">
      <h2>update 手动更新</h2>
      <p class="play-desc">动态修改内容后，调用 update 方法手动刷新滚动条状态</p>
      <div class="play-controls">
        <me-button size="small" @click="addItem">追加 10 项</me-button>
        <me-button size="small" @click="removeItem">移除 10 项</me-button>
        <me-button size="small" @click="handleUpdate">手动 update</me-button>
      </div>
      <div class="play-border">
        <me-scrollbar
          ref="dynamicRef"
          :height="250"
        >
          <div
            v-for="item in dynamicData"
            :key="item.id"
            class="play-item"
            :class="{ 'is-odd': item.id % 2 === 1 }"
          >
            <span class="play-item-index">#{{ String(item.id).padStart(3, '0') }}</span>
            <span class="play-item-label">{{ item.label }}</span>
          </div>
        </me-scrollbar>
      </div>
      <p class="play-label">当前数据量：{{ dynamicData.length }} 条</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import MeButton from '../src/components/button';
import MeScrollbar from '../src/components/scrollbar';

/** scrollDemo 引用 */
const scrollDemoRef = ref<InstanceType<typeof MeScrollbar>>();

/** 当前 scrollTop */
const currentScrollTop = ref(0);
/** 当前 scrollLeft */
const currentScrollLeft = ref(0);

/** scroll 事件（setScrollTop 演示区） */
function onScrollEvent(scrollTop: number, scrollLeft: number) {
  currentScrollTop.value = scrollTop;
  currentScrollLeft.value = scrollLeft;
}

/** scroll 事件演示区 scrollTop */
const eventScrollTop = ref(0);
/** scroll 事件演示区 scrollLeft */
const eventScrollLeft = ref(0);

/** scroll 事件（事件监听演示区） */
function onScrollEvent2(scrollTop: number, scrollLeft: number) {
  eventScrollTop.value = scrollTop;
  eventScrollLeft.value = scrollLeft;
}

/**
 * 设置 scrollTop
 * @param value 目标位置
 * @param smooth 是否平滑滚动
 */
function handleScrollTop(value: number, smooth: boolean) {
  scrollDemoRef.value?.setScrollTop(value, smooth);
}

/**
 * 设置 scrollLeft
 * @param value 目标位置
 * @param smooth 是否平滑滚动
 */
function handleScrollLeft(value: number, smooth: boolean) {
  scrollDemoRef.value?.setScrollLeft(value, smooth);
}

/** 动态数据项类型 */
interface DynamicItem {
  id: number;
  label: string;
}

/** 动态数据 */
const dynamicData = ref<DynamicItem[]>(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    label: `初始项 ${i + 1}`,
  })),
);

/** 动态数据 ID 自增计数器 */
let dynamicIdCounter = 21;

/** 动态列表引用 */
const dynamicRef = ref<InstanceType<typeof MeScrollbar>>();

/** 追加 10 项 */
function addItem() {
  const newItems: DynamicItem[] = Array.from({ length: 10 }, () => ({
    id: dynamicIdCounter++,
    label: `追加项 ${dynamicIdCounter - 1}`,
  }));
  dynamicData.value = [...dynamicData.value, ...newItems];
}

/** 移除 10 项 */
function removeItem() {
  if (dynamicData.value.length > 10) {
    dynamicData.value = dynamicData.value.slice(0, -10);
  }
}

/** 手动更新滚动条 */
function handleUpdate() {
  dynamicRef.value?.update();
}
</script>

<style lang="less" scoped>
.play-scrollbar {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.play-section {
  margin-bottom: 32px;

  h2 {
    margin: 0 0 4px;
    font-size: 18px;
    color: #1f2329;
  }
}

.play-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #8a9099;
}

.play-border {
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  overflow: hidden;
}

.play-controls {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12px;

  .me-button {
    margin-right: 8px;
    margin-bottom: 8px;
  }
}

.play-label {
  margin-top: 8px;
  font-size: 13px;
  color: #8a9099;
}

.play-item {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid #f2f3f5;
  font-size: 14px;
  color: #1f2329;
  white-space: nowrap;

  &.is-odd {
    background-color: #fafbfc;
  }
}

.play-item-index {
  width: 60px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  color: #86909c;
}

.play-item-label {
  flex: 1;
}

.play-horizontal-content {
  display: inline-flex;
  flex-direction: column;
}

.play-horizontal-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100px;
  margin-right: 12px;
  border-radius: 6px;
  background-color: #e8f3ff;
  color: #165dff;
  font-size: 14px;
  flex-shrink: 0;
}
</style>
