<!-- ? Tooltip 组件示例 -->
<template>
  <div class="play-root">
    <h1>MeTooltip 示例</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <div class="play-row">
        <me-tooltip content="这是提示内容">
          <me-button>Hover 悬浮提示</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 不同位置 -->
    <section class="play-section">
      <h2>不同位置</h2>
      <div class="play-row">
        <me-tooltip content="Top 提示" placement="top">
          <me-button>Top</me-button>
        </me-tooltip>
        <me-tooltip content="Bottom 提示" placement="bottom">
          <me-button>Bottom</me-button>
        </me-tooltip>
        <me-tooltip content="Left 提示" placement="left">
          <me-button>Left</me-button>
        </me-tooltip>
        <me-tooltip content="Right 提示" placement="right">
          <me-button>Right</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 对齐方式 - top/bottom -->
    <section class="play-section">
      <h2>对齐方式 - Top/Bottom</h2>
      <div class="play-row">
        <me-tooltip content="Top Start" placement="top-start">
          <me-button>Top Start</me-button>
        </me-tooltip>
        <me-tooltip content="Top End" placement="top-end">
          <me-button>Top End</me-button>
        </me-tooltip>
        <me-tooltip content="Bottom Start" placement="bottom-start">
          <me-button>Bottom Start</me-button>
        </me-tooltip>
        <me-tooltip content="Bottom End" placement="bottom-end">
          <me-button>Bottom End</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 对齐方式 - left/right -->
    <section class="play-section">
      <h2>对齐方式 - Left/Right</h2>
      <div class="play-row">
        <me-tooltip content="Left Start" placement="left-start">
          <me-button>Left Start</me-button>
        </me-tooltip>
        <me-tooltip content="Left End" placement="left-end">
          <me-button>Left End</me-button>
        </me-tooltip>
        <me-tooltip content="Right Start" placement="right-start">
          <me-button>Right Start</me-button>
        </me-tooltip>
        <me-tooltip content="Right End" placement="right-end">
          <me-button>Right End</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 触发方式 -->
    <section class="play-section">
      <h2>触发方式</h2>
      <div class="play-row">
        <me-tooltip content="Click 触发" trigger="click">
          <me-button>Click</me-button>
        </me-tooltip>
        <me-tooltip content="Focus 触发" trigger="focus">
          <me-button>Focus</me-button>
        </me-tooltip>
        <me-tooltip content="Contextmenu 触发" trigger="contextmenu">
          <me-button>右键菜单</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 多触发方式组合 -->
    <section class="play-section">
      <h2>多触发方式组合</h2>
      <div class="play-row">
        <me-tooltip content="Hover 或 Click 均可触发" :trigger="['hover', 'click']">
          <me-button>Hover + Click</me-button>
        </me-tooltip>
        <me-tooltip content="Focus 或 Click 均可触发" :trigger="['focus', 'click']">
          <me-button>Focus + Click</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用</h2>
      <div class="play-row">
        <me-tooltip content="这个提示不会显示" disabled>
          <me-button>Disabled Tooltip</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 受控模式 -->
    <section class="play-section">
      <h2>受控模式（v-model:visible）</h2>
      <div class="play-row">
        <me-tooltip v-model:visible="controlledVisible" content="受控的提示">
          <me-button>受控 Tooltip</me-button>
        </me-tooltip>
        <me-button type="primary" @click="controlledVisible = !controlledVisible">
          {{ controlledVisible ? '关闭' : '打开' }}
        </me-button>
      </div>
    </section>

    <!-- 事件回调 -->
    <section class="play-section">
      <h2>事件回调</h2>
      <div class="play-row">
        <me-tooltip
          content="观察控制台输出"
          @before-show="onBeforeShow"
          @before-hide="onBeforeHide"
          @show="onShow"
          @hide="onHide"
        >
          <me-button>事件回调</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- z-index -->
    <section class="play-section">
      <h2>z-index</h2>
      <div class="play-row">
        <me-tooltip content="z-index: 3000" :z-index="3000">
          <me-button>z-index 3000</me-button>
        </me-tooltip>
        <me-tooltip content="z-index: 5000" :z-index="5000">
          <me-button>z-index 5000</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 自定义内容插槽 -->
    <section class="play-section">
      <h2>自定义内容插槽</h2>
      <div class="play-row">
        <me-tooltip>
          <me-button>自定义内容</me-button>
          <template #content>
            <span style="color: #409eff; font-weight: bold;">自定义 HTML 内容</span>
          </template>
        </me-tooltip>
      </div>
    </section>

    <!-- 长内容 -->
    <section class="play-section">
      <h2>长内容</h2>
      <div class="play-row">
        <me-tooltip content="这是一段很长的提示内容，用来测试长文本在 tooltip 中的显示效果，看看是否会自动换行或者超出边界">
          <me-button>长内容提示</me-button>
        </me-tooltip>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** 受控模式 visible */
const controlledVisible = ref(false);

/** 显示前回调 */
function onBeforeShow() {
  console.log('beforeShow');
}

/** 隐藏前回调 */
function onBeforeHide() {
  console.log('beforeHide');
}

/** 已显示回调 */
function onShow() {
  console.log('show');
}

/** 已隐藏回调 */
function onHide() {
  console.log('hide');
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
</style>
