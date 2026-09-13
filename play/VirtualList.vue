<!-- 虚拟列表组件示例 -->
<template>
  <div class="play-virtual-list">
    <h1>MeVirtualList 虚拟列表</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">1000 条数据，固定项高度 40px，容器高度 300px</p>
      <div class="play-border">
        <me-virtual-list
          :data="basicData"
          :height="300"
          :item-height="40"
          item-key="id"
        >
          <template #default="{ item, index }">
            <div class="play-item" :class="{ 'is-odd': index % 2 === 0 }">
              <span class="play-item-index">#{{ item.id }}</span>
              <span class="play-item-label">{{ item.label }}</span>
            </div>
          </template>
        </me-virtual-list>
      </div>
    </section>

    <!-- 大数据量 -->
    <section class="play-section">
      <h2>大数据量（100000 条）</h2>
      <p class="play-desc">10 万条数据虚拟滚动，验证渲染性能</p>
      <div class="play-border">
        <me-virtual-list
          :data="hugeData"
          :height="400"
          :item-height="36"
          item-key="id"
        >
          <template #default="{ item, index }">
            <div class="play-item play-item-sm" :class="{ 'is-odd': index % 2 === 0 }">
              <span class="play-item-index">{{ item.id }}</span>
              <span class="play-item-label">{{ item.label }}</span>
              <span class="play-item-tag">{{ item.category }}</span>
            </div>
          </template>
        </me-virtual-list>
      </div>
    </section>

    <!-- scrollTo 滚动定位 -->
    <section class="play-section">
      <h2>scrollTo 滚动定位</h2>
      <p class="play-desc">通过 ref 调用 scrollTo 方法，滚动到指定索引或 key</p>
      <p class="play-desc">
        align：'top' 顶部对齐 | 'bottom' 底部对齐 | 'auto' 仅不可见时滚动（默认 top）<br />
        behavior：'smooth' 平滑滚动 | 'auto' 瞬间跳转（默认 auto）<br />
        offset：额外偏移量（px），正数向下偏移，负数向上偏移（默认 0）
      </p>
      <div class="play-controls">
        <me-button size="small" @click="scrollToIndex(0, 'top')">第 0 项 · top</me-button>
        <me-button size="small" @click="scrollToIndex(100, 'top')">第 100 项 · top</me-button>
        <me-button size="small" @click="scrollToIndex(100, 'bottom')">第 100 项 · bottom</me-button>
        <me-button size="small" @click="scrollToIndex(100, 'auto')">第 100 项 · auto</me-button>
        <me-button size="small" @click="scrollToIndex(500, 'top')">第 500 项 · top</me-button>
        <me-button size="small" @click="scrollToIndex(500, 'bottom')">第 500 项 · bottom</me-button>
        <me-button size="small" @click="scrollToIndex(500, 'auto')">第 500 项 · auto</me-button>
        <me-button size="small" @click="scrollToIndex(999, 'bottom')">最后一项 · bottom</me-button>
        <me-button size="small" @click="scrollToKey(250, 'top')">key=250 · top</me-button>
        <me-button size="small" @click="scrollToKey(250, 'bottom')">key=250 · bottom</me-button>
        <me-button size="small" @click="scrollToKey(250, 'auto')">key=250 · auto</me-button>
      </div>
      <div class="play-controls">
        <me-button size="small" @click="scrollToIndexWithOffset(100, 'top', 50)">第 100 项 · top · offset+50</me-button>
        <me-button size="small" @click="scrollToIndexWithOffset(100, 'top', -50)">第 100 项 · top · offset-50</me-button>
        <me-button size="small" @click="scrollToIndexWithOffset(100, 'bottom', 50)">第 100 项 · bottom · offset+50</me-button>
        <me-button size="small" @click="scrollToIndexWithOffset(500, 'top', 100)">第 500 项 · top · offset+100</me-button>
        <me-button size="small" @click="scrollToKeyWithOffset(250, 'top', 50)">key=250 · top · offset+50</me-button>
        <me-button size="small" @click="scrollToKeyWithOffset(250, 'bottom', -50)">key=250 · bottom · offset-50</me-button>
      </div>
      <div class="play-border">
        <me-virtual-list
          ref="scrollDemoRef"
          :data="scrollData"
          :height="300"
          :item-height="40"
          item-key="id"
          @scroll="onScrollEvent"
        >
          <template #default="{ item, index }">
            <div class="play-item" :class="{ 'is-odd': index % 2 === 0, 'is-highlight': item.id === 250 }">
              <span class="play-item-index">#{{ item.id }}</span>
              <span class="play-item-label">{{ item.label }}</span>
              <span v-if="item.id === 250" class="play-item-badge">目标项</span>
            </div>
          </template>
        </me-virtual-list>
      </div>
      <p class="play-label">当前 scrollTop：{{ currentScrollTop }}px</p>
    </section>

    <!-- 动态数据切换 -->
    <section class="play-section">
      <h2>动态数据切换</h2>
      <p class="play-desc">切换不同数据源，验证虚拟列表响应式更新</p>
      <div class="play-controls">
        <me-button size="small" @click="switchData('small')">小数据（50 条）</me-button>
        <me-button size="small" @click="switchData('medium')">中数据（500 条）</me-button>
        <me-button size="small" @click="switchData('large')">大数据（5000 条）</me-button>
        <me-button size="small" @click="addItem">追加一项</me-button>
        <me-button size="small" @click="removeItem">移除首项</me-button>
      </div>
      <div class="play-border">
        <me-virtual-list
          :data="dynamicData"
          :height="250"
          :item-height="40"
          item-key="id"
        >
          <template #default="{ item, index }">
            <div class="play-item" :class="{ 'is-odd': index % 2 === 0 }">
              <span class="play-item-index">#{{ item.id }}</span>
              <span class="play-item-label">{{ item.label }}</span>
            </div>
          </template>
        </me-virtual-list>
      </div>
      <p class="play-label">当前数据量：{{ dynamicData.length }} 条</p>
    </section>

    <!-- 非虚拟模式 -->
    <section class="play-section">
      <h2>非虚拟模式</h2>
      <p class="play-desc">不传 virtual / itemHeight 时，退化为普通滚动列表</p>
      <div class="play-border">
        <me-virtual-list
          :data="basicData.slice(0, 20)"
          :height="300"
          item-key="id"
        >
          <template #default="{ item, index }">
            <div class="play-item" :class="{ 'is-odd': index % 2 === 0 }">
              <span class="play-item-index">#{{ item.id }}</span>
              <span class="play-item-label">{{ item.label }}</span>
            </div>
          </template>
        </me-virtual-list>
      </div>
    </section>

    <!-- 自定义渲染 -->
    <section class="play-section">
      <h2>自定义渲染</h2>
      <p class="play-desc">通过 slot 自定义每项的渲染内容和样式</p>
      <div class="play-border">
        <me-virtual-list
          :data="userList"
          :height="350"
          :item-height="60"
          item-key="id"
        >
          <template #default="{ item }">
            <div class="play-user-item">
              <div class="play-user-avatar" :class="`play-avatar-${item.color}`">
                {{ item.name.charAt(0) }}
              </div>
              <div class="play-user-info">
                <div class="play-user-name">{{ item.name }}</div>
                <div class="play-user-email">{{ item.email }}</div>
              </div>
              <div class="play-user-status" :class="item.online ? 'is-online' : 'is-offline'">
                {{ item.online ? '在线' : '离线' }}
              </div>
            </div>
          </template>
        </me-virtual-list>
      </div>
    </section>

    <!-- 可变高度 -->
    <section class="play-section">
      <h2>可变高度</h2>
      <p class="play-desc">每个列表项高度不同（60px ~ 200px 随机），itemHeight 仅作为预估高度，实际高度由 useItemHeights 动态测量</p>
      <p class="play-desc">auto 模式：瞬间跳转，多帧修正高度误差</p>
      <div class="play-controls">
        <me-button size="small" @click="scrollVariableTo(0, 'top', 'auto')">第 0 项 · auto</me-button>
        <me-button size="small" @click="scrollVariableTo(50, 'top', 'auto')">第 50 项 · auto</me-button>
        <me-button size="small" @click="scrollVariableTo(200, 'top', 'auto')">第 200 项 · auto</me-button>
        <me-button size="small" @click="scrollVariableTo(499, 'bottom', 'auto')">最后一项 · auto</me-button>
        <me-button size="small" @click="scrollVariableToKey(100, 'top', 'auto')">key=100 · auto</me-button>
      </div>
      <p class="play-desc">smooth 模式：平滑滚动动画，每帧动态收集高度并修正目标位置</p>
      <div class="play-controls">
        <me-button size="small" @click="scrollVariableTo(0, 'top', 'smooth')">第 0 项 · smooth</me-button>
        <me-button size="small" @click="scrollVariableTo(50, 'top', 'smooth')">第 50 项 · smooth</me-button>
        <me-button size="small" @click="scrollVariableTo(200, 'top', 'smooth')">第 200 项 · smooth</me-button>
        <me-button size="small" @click="scrollVariableTo(499, 'bottom', 'smooth')">最后一项 · smooth</me-button>
        <me-button size="small" @click="scrollVariableToKey(100, 'top', 'smooth')">key=100 · smooth</me-button>
      </div>
      <div class="play-border">
        <me-virtual-list
          ref="variableListRef"
          :data="variableData"
          :height="400"
          :item-height="100"
          item-key="id"
          @scroll="onVariableScrollEvent"
        >
          <template #default="{ item, index }">
            <div
              class="play-variable-item"
              :class="{ 'is-odd': index % 2 === 0, 'is-highlight': item.id === 100 }"
              :style="{ height: `${item.height}px` }"
            >
              <div class="play-variable-header">
                <span class="play-item-index">#{{ item.id }}</span>
                <span class="play-variable-height">高度: {{ item.height }}px</span>
                <span v-if="item.id === 100" class="play-item-badge">目标项</span>
              </div>
              <div class="play-variable-body">
                {{ item.content }}
              </div>
            </div>
          </template>
        </me-virtual-list>
      </div>
      <p class="play-label">当前 scrollTop：{{ variableScrollTop }}px</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import MeButton from '../src/components/button';
import MeVirtualList from '../src/components/virtual-list';
import type { ScrollAlign } from '../src/components/virtual-list/types';

/** 数据项类型 */
interface DataItem {
  id: number;
  label: string;
  category: string;
}

/** 用户项类型 */
interface UserItem {
  id: number;
  name: string;
  email: string;
  online: boolean;
  color: string;
}

/** 可变高度项类型 */
interface VariableItem {
  id: number;
  height: number;
  content: string;
}

/** 生成基础数据 */
function generateData(count: number): DataItem[] {
  const categories = ['科技', '金融', '医疗', '教育', '娱乐', '体育', '房产', '能源'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    label: `数据项 ${String(i + 1).padStart(5, '0')}`,
    category: categories[i % categories.length],
  }));
}

/** 生成用户数据 */
function generateUsers(count: number): UserItem[] {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '冯十二'];
  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'cyan'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `${names[i % names.length]}${i >= names.length ? i : ''}`,
    email: `user${i + 1}@example.com`,
    online: i % 3 !== 0,
    color: colors[i % colors.length],
  }));
}

/** 基础数据（1000 条） */
const basicData = ref(generateData(1000));

/** 大数据（100000 条） */
const hugeData = ref(generateData(100000));

/** scrollTo 演示数据 */
const scrollData = ref(generateData(1000));

/** scrollTo 演示引用 */
const scrollDemoRef = ref<InstanceType<typeof MeVirtualList>>();

/** 当前 scrollTop */
const currentScrollTop = ref(0);

/** 滚动事件 */
function onScrollEvent(scrollTop: number) {
  currentScrollTop.value = scrollTop;
}

/**
 * 定位到指定索引
 * @param index 目标索引
 * @param align 对齐方式：'top' 顶部对齐 | 'bottom' 底部对齐 | 'auto' 仅不可见时滚动
 */
function scrollToIndex(index: number, align: ScrollAlign = 'top') {
  scrollDemoRef.value?.scrollTo({ index, align, behavior: 'smooth' });
}

/**
 * 定位到指定 key
 * @param key 目标 key
 * @param align 对齐方式：'top' 顶部对齐 | 'bottom' 底部对齐 | 'auto' 仅不可见时滚动
 */
function scrollToKey(key: number, align: ScrollAlign = 'top') {
  scrollDemoRef.value?.scrollTo({ key, align, behavior: 'smooth' });
}

/**
 * 定位到指定索引（带偏移量）
 * @param index 目标索引
 * @param align 对齐方式
 * @param offset 额外偏移量（px），正数向下偏移，负数向上偏移
 */
function scrollToIndexWithOffset(index: number, align: ScrollAlign, offset: number) {
  scrollDemoRef.value?.scrollTo({ index, align, offset, behavior: 'smooth' });
}

/**
 * 定位到指定 key（带偏移量）
 * @param key 目标 key
 * @param align 对齐方式
 * @param offset 额外偏移量（px），正数向下偏移，负数向上偏移
 */
function scrollToKeyWithOffset(key: number, align: ScrollAlign, offset: number) {
  scrollDemoRef.value?.scrollTo({ key, align, offset, behavior: 'smooth' });
}

/** 动态数据 */
const dynamicData = ref<DataItem[]>(generateData(50));

/** 动态数据 ID 自增计数器 */
let dynamicIdCounter = 50;

/** 切换数据源 */
function switchData(type: 'small' | 'medium' | 'large') {
  const count = type === 'small' ? 50 : type === 'medium' ? 500 : 5000;
  dynamicData.value = generateData(count);
  dynamicIdCounter = count;
}

/** 追加一项 */
function addItem() {
  dynamicData.value = [
    ...dynamicData.value,
    {
      id: dynamicIdCounter++,
      label: `新增项 ${dynamicIdCounter}`,
      category: '新增',
    },
  ];
}

/** 移除首项 */
function removeItem() {
  if (dynamicData.value.length > 0) {
    dynamicData.value = dynamicData.value.slice(1);
  }
}

/** 用户列表数据 */
const userList = ref(generateUsers(2000));

/** 生成可变高度数据（高度 60~200px 随机） */
function generateVariableData(count: number): VariableItem[] {
  const contents = [
    '这是一段简短的文本内容。',
    '这是一段中等长度的文本内容，包含更多的描述信息，用于展示在可变高度的列表项中。',
    '这是一段较长的文本内容，包含更多的描述信息，用于展示在可变高度的列表项中。虚拟列表会根据实际渲染后的 DOM 高度动态测量并缓存，确保滚动位置计算准确。即使每项高度不同，也能正确计算可见区间和偏移量。',
    '短文本。',
    '这是一段非常长的文本内容，用于测试虚拟列表在极端高度差异下的表现。虚拟列表的核心计算逻辑会遍历所有数据项，根据缓存的高度或预估高度累加，找到当前 scrollTop 对应的可见区间。当实际高度与预估高度不一致时，会触发 collectHeight 重新测量并更新缓存，同时通过 updatedMark 触发重新计算，确保滚动位置的准确性。这种机制使得虚拟列表能够完美支持可变高度的列表项，而无需预先知道每项的确切高度。',
  ];
  return Array.from({ length: count }, (_, i) => {
    const contentIndex = i % contents.length;
    /** 随机高度 60~200px */
    const height = Math.floor(Math.random() * 141) + 60;
    return {
      id: i,
      height,
      content: contents[contentIndex],
    };
  });
}

/** 可变高度数据（500 条） */
const variableData = ref(generateVariableData(500));

/** 可变高度列表引用 */
const variableListRef = ref<InstanceType<typeof MeVirtualList>>();

/** 可变高度列表当前 scrollTop */
const variableScrollTop = ref(0);

/** 可变高度列表滚动事件 */
function onVariableScrollEvent(scrollTop: number) {
  variableScrollTop.value = scrollTop;
}

/**
 * 定位到指定索引（可变高度）
 * @param index 目标索引
 * @param align 对齐方式
 * @param behavior 滚动行为：'auto' 瞬间跳转 | 'smooth' 平滑滚动
 */
function scrollVariableTo(index: number, align: ScrollAlign = 'top', behavior: 'auto' | 'smooth' = 'auto') {
  variableListRef.value?.scrollTo({ index, align, behavior });
}

/**
 * 定位到指定 key（可变高度）
 * @param key 目标 key
 * @param align 对齐方式
 * @param behavior 滚动行为：'auto' 瞬间跳转 | 'smooth' 平滑滚动
 */
function scrollVariableToKey(key: number, align: ScrollAlign = 'top', behavior: 'auto' | 'smooth' = 'auto') {
  variableListRef.value?.scrollTo({ key, align, behavior });
}
</script>

<style lang="less" scoped>
.play-virtual-list {
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

  &.is-odd {
    background-color: #fafbfc;
  }

  &.is-highlight {
    background-color: #fff7e6;
    border-left: 3px solid #ff9a2e;
  }
}

.play-item-sm {
  height: 36px;
  font-size: 13px;
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

.play-item-tag {
  padding: 2px 8px;
  border-radius: 3px;
  background-color: #e8f3ff;
  color: #165dff;
  font-size: 12px;
}

.play-item-badge {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 3px;
  background-color: #ff9a2e;
  color: #fff;
  font-size: 12px;
}

.play-user-item {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 16px;
  border-bottom: 1px solid #f2f3f5;
}

.play-user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-right: 12px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.play-avatar-blue { background-color: #4080ff; }
.play-avatar-green { background-color: #00b42a; }
.play-avatar-orange { background-color: #ff7d00; }
.play-avatar-purple { background-color: #722ed1; }
.play-avatar-red { background-color: #f53f3f; }
.play-avatar-cyan { background-color: #14c9c9; }

.play-user-info {
  flex: 1;
  min-width: 0;
}

.play-user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.play-user-email {
  margin-top: 2px;
  font-size: 12px;
  color: #86909c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.play-user-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  flex-shrink: 0;

  &.is-online {
    background-color: #e8ffea;
    color: #00b42a;
  }

  &.is-offline {
    background-color: #f2f3f5;
    color: #86909c;
  }
}

.play-variable-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f2f3f5;
  box-sizing: border-box;
  overflow: hidden;

  &.is-odd {
    background-color: #fafbfc;
  }
}

.play-variable-header {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.play-variable-height {
  margin-left: 8px;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: #fff2e8;
  color: #ff7d00;
  font-size: 11px;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.play-variable-body {
  font-size: 13px;
  line-height: 1.5;
  color: #4e5969;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
