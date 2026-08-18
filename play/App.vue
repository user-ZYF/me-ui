<!-- ? MeTag 标签组件使用示例 -->
<template>
  <div class="play-root">
    <h1>MeTag 标签组件示例</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <div class="play-row">
        <me-tag>标签一</me-tag>
        <me-tag type="primary">Primary</me-tag>
        <me-tag type="success">Success</me-tag>
        <me-tag type="warning">Warning</me-tag>
        <me-tag type="danger">Danger</me-tag>
        <me-tag type="info">Info</me-tag>
      </div>
    </section>

    <!-- 主题效果 -->
    <section class="play-section">
      <h2>主题效果</h2>
      <div class="play-row">
        <me-tag effect="dark">Dark Default</me-tag>
        <me-tag type="primary" effect="dark">Dark Primary</me-tag>
        <me-tag type="success" effect="dark">Dark Success</me-tag>
        <me-tag type="danger" effect="dark">Dark Danger</me-tag>
      </div>
      <div class="play-row">
        <me-tag effect="plain">Plain Default</me-tag>
        <me-tag type="primary" effect="plain">Plain Primary</me-tag>
        <me-tag type="success" effect="plain">Plain Success</me-tag>
        <me-tag type="danger" effect="plain">Plain Danger</me-tag>
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="play-section">
      <h2>尺寸</h2>
      <div class="play-row">
        <me-tag size="large">Large</me-tag>
        <me-tag size="default">Default</me-tag>
        <me-tag size="small">Small</me-tag>
      </div>
      <div class="play-row">
        <me-tag type="primary" size="large">Large Primary</me-tag>
        <me-tag type="primary" size="default">Default Primary</me-tag>
        <me-tag type="primary" size="small">Small Primary</me-tag>
      </div>
    </section>

    <!-- 可关闭 -->
    <section class="play-section">
      <h2>可关闭</h2>
      <div class="play-row">
        <me-tag
          v-for="tag in closableTags"
          :key="tag.id"
          :type="tag.type"
          closable
          @close="handleClose(tag)"
        >
          {{ tag.name }}
        </me-tag>
      </div>
    </section>

    <!-- 动态添加/删除 -->
    <section class="play-section">
      <h2>动态添加/删除</h2>
      <div class="play-row">
        <me-tag
          v-for="tag in dynamicTags"
          :key="tag.id"
          :type="tag.type"
          closable
          @close="handleRemove(tag)"
        >
          {{ tag.name }}
        </me-tag>
        <me-input
          v-if="inputVisible"
          ref="inputRef"
          v-model="inputValue"
          class="play-input"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <me-button v-else size="small" @click="showInput">+ 添加标签</me-button>
      </div>
    </section>

    <!-- 点击事件 -->
    <section class="play-section">
      <h2>点击事件</h2>
      <div class="play-row">
        <me-tag type="primary" @click="onClickTag('Primary Tag')">Primary Tag</me-tag>
        <me-tag type="success" @click="onClickTag('Success Tag')">Success Tag</me-tag>
        <me-tag type="warning" @click="onClickTag('Warning Tag')">Warning Tag</me-tag>
      </div>
    </section>

    <!-- 不同主题 + 尺寸组合 -->
    <section class="play-section">
      <h2>不同主题 + 尺寸组合</h2>
      <div class="play-row">
        <me-tag type="primary" effect="dark" size="large">Dark Large</me-tag>
        <me-tag type="success" effect="plain" size="small">Plain Small</me-tag>
        <me-tag type="danger" effect="dark" size="small">Dark Small</me-tag>
        <me-tag type="info" effect="plain" size="large">Plain Large</me-tag>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import type MeInput from '../src/components/input/Input.vue';
import type { ComponentType } from '../src/types/config';

/** 可关闭标签项 */
interface TagItem {
  /** 唯一标识 */
  id: number;
  /** 标签名称 */
  name: string;
  /** 标签类型 */
  type: ComponentType;
}

/** 可关闭标签列表 */
const closableTags = ref<TagItem[]>([
  { id: 1, name: '标签一', type: 'default' },
  { id: 2, name: '标签二', type: 'success' },
  { id: 3, name: '标签三', type: 'info' },
]);

/** 关闭标签 */
function handleClose(tag: TagItem) {
  closableTags.value = closableTags.value.filter((item) => item.id !== tag.id);
}

/** 动态标签列表 */
const dynamicTags = ref<TagItem[]>([
  { id: 1, name: 'HTML', type: 'default' },
  { id: 2, name: 'CSS', type: 'success' },
  { id: 3, name: 'JavaScript', type: 'warning' },
]);

/** 是否显示输入框 */
const inputVisible = ref(false);

/** 输入框值 */
const inputValue = ref('');

/** 输入框引用 */
const inputRef = ref<InstanceType<typeof MeInput>>();

/** 标签 ID 自增 */
let tagId = 4;

/** 显示输入框 */
function showInput() {
  inputVisible.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
}

/** 确认输入 */
function handleInputConfirm() {
  if (inputValue.value) {
    dynamicTags.value.push({
      id: tagId++,
      name: inputValue.value,
      type: 'primary',
    });
  }
  inputVisible.value = false;
  inputValue.value = '';
}

/** 移除动态标签 */
function handleRemove(tag: TagItem) {
  dynamicTags.value = dynamicTags.value.filter((item) => item.id !== tag.id);
}

/** 点击标签 */
function onClickTag(name: string) {
  console.log('click tag:', name);
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

.play-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  > * {
    margin-right: 12px;
    margin-bottom: 8px;
  }
}

.play-input {
  width: 120px;
}
</style>
