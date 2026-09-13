<!-- MeTooltip 文字提示组件使用示例 -->
<template>
  <div class="play-root">
    <h1>MeTooltip 文字提示组件示例</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">鼠标悬停触发元素时显示提示文字，默认位置为 top</p>
      <div class="play-demo-row">
        <me-tooltip content="这是一段提示文字">
          <me-button>悬停查看提示</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 不同位置 -->
    <section class="play-section">
      <h2>不同位置</h2>
      <p class="play-desc">通过 placement 设置弹出位置，支持 12 个方向</p>
      <div class="play-placement-grid">
        <div class="play-placement-row">
          <me-tooltip content="top-start" placement="top-start">
            <me-button>top-start</me-button>
          </me-tooltip>
          <me-tooltip content="top" placement="top">
            <me-button>top</me-button>
          </me-tooltip>
          <me-tooltip content="top-end" placement="top-end">
            <me-button>top-end</me-button>
          </me-tooltip>
        </div>
        <div class="play-placement-row">
          <me-tooltip content="left-start" placement="left-start">
            <me-button>left-start</me-button>
          </me-tooltip>
          <me-tooltip content="left" placement="left">
            <me-button>left</me-button>
          </me-tooltip>
          <me-tooltip content="left-end" placement="left-end">
            <me-button>left-end</me-button>
          </me-tooltip>
        </div>
        <div class="play-placement-row">
          <me-tooltip content="right-start" placement="right-start">
            <me-button>right-start</me-button>
          </me-tooltip>
          <me-tooltip content="right" placement="right">
            <me-button>right</me-button>
          </me-tooltip>
          <me-tooltip content="right-end" placement="right-end">
            <me-button>right-end</me-button>
          </me-tooltip>
        </div>
        <div class="play-placement-row">
          <me-tooltip content="bottom-start" placement="bottom-start">
            <me-button>bottom-start</me-button>
          </me-tooltip>
          <me-tooltip content="bottom" placement="bottom">
            <me-button>bottom</me-button>
          </me-tooltip>
          <me-tooltip content="bottom-end" placement="bottom-end">
            <me-button>bottom-end</me-button>
          </me-tooltip>
        </div>
      </div>
    </section>

    <!-- 主题效果 -->
    <section class="play-section">
      <h2>主题效果</h2>
      <p class="play-desc">通过 effect 设置主题，支持 dark（默认）和 light 两种</p>
      <div class="play-demo-row">
        <me-tooltip content="深色主题提示" effect="dark">
          <me-button>dark</me-button>
        </me-tooltip>
        <me-tooltip content="浅色主题提示" effect="light">
          <me-button>light</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 触发方式 -->
    <section class="play-section">
      <h2>触发方式</h2>
      <p class="play-desc">通过 trigger 设置触发方式：hover、click、focus、contextmenu，支持数组组合</p>
      <div class="play-demo-row">
        <me-tooltip content="悬停触发" trigger="hover">
          <me-button>hover</me-button>
        </me-tooltip>
        <me-tooltip content="点击触发，再次点击关闭" trigger="click">
          <me-button>click</me-button>
        </me-tooltip>
        <me-tooltip content="聚焦触发" trigger="focus">
          <me-button>focus</me-button>
        </me-tooltip>
        <me-tooltip content="右键触发" trigger="contextmenu">
          <me-button>contextmenu</me-button>
        </me-tooltip>
        <me-tooltip content="悬停或点击均可触发" :trigger="['hover', 'click']">
          <me-button>hover + click</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 自定义内容 -->
    <section class="play-section">
      <h2>自定义内容</h2>
      <p class="play-desc">通过 content 插槽自定义提示内容，支持富文本和组件</p>
      <div class="play-demo-row">
        <me-tooltip>
          <me-button>自定义 HTML 内容</me-button>
          <template #content>
            <div class="play-custom-content">
              <p class="play-custom-content-title">自定义标题</p>
              <p class="play-custom-content-desc">支持任意 HTML 内容</p>
              <p class="play-custom-content-desc">可以多行显示</p>
            </div>
          </template>
        </me-tooltip>
      </div>
    </section>

    <!-- 受控模式 -->
    <section class="play-section">
      <h2>受控模式</h2>
      <p class="play-desc">通过 v-model:visible 控制显示/隐藏，适用于编程式触发场景</p>
      <div class="play-demo-row">
        <me-tooltip v-model:visible="controlledVisible" content="受控模式的提示">
          <me-button>受控 Tooltip</me-button>
        </me-tooltip>
        <me-button :type="controlledVisible ? 'primary' : 'default'" @click="controlledVisible = !controlledVisible">
          {{ controlledVisible ? '隐藏' : '显示' }}
        </me-button>
        <span class="play-label">当前状态：{{ controlledVisible ? '显示中' : '隐藏中' }}</span>
      </div>
    </section>

    <!-- 延迟显示/隐藏 -->
    <section class="play-section">
      <h2>延迟显示/隐藏</h2>
      <p class="play-desc">通过 show-after 和 hide-after 设置显示和隐藏的延迟时间（毫秒）</p>
      <div class="play-demo-row">
        <me-tooltip content="延迟 500ms 后显示" :show-after="500">
          <me-button>show-after 500ms</me-button>
        </me-tooltip>
        <me-tooltip content="移出后延迟 1000ms 隐藏" :hide-after="1000">
          <me-button>hide-after 1000ms</me-button>
        </me-tooltip>
        <me-tooltip content="延迟 300ms 显示，延迟 800ms 隐藏" :show-after="300" :hide-after="800">
          <me-button>show 300ms + hide 800ms</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用</h2>
      <p class="play-desc">设置 disabled 后不会显示提示</p>
      <div class="play-demo-row">
        <me-tooltip content="这个提示不会显示" disabled>
          <me-button>disabled Tooltip</me-button>
        </me-tooltip>
        <me-button @click="toggleDisabled">
          切换禁用状态：{{ isDisabled ? '已禁用' : '已启用' }}
        </me-button>
        <me-tooltip content="动态切换禁用状态" :disabled="isDisabled">
          <me-button>动态 disabled</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 自定义弹出层类名 -->
    <section class="play-section">
      <h2>自定义弹出层类名</h2>
      <p class="play-desc">通过 popper-class 为弹出层添加自定义类名，实现样式定制</p>
      <div class="play-demo-row">
        <me-tooltip content="自定义样式的提示" popper-class="play-custom-tooltip">
          <me-button>自定义 popper-class</me-button>
        </me-tooltip>
      </div>
    </section>

    <!-- 事件演示 -->
    <section class="play-section">
      <h2>事件演示</h2>
      <p class="play-desc">监听 before-show / before-hide / show / hide 事件</p>
      <div class="play-demo-row">
        <me-tooltip
          content="操作我来看事件日志"
          @before-show="onBeforeShow"
          @before-hide="onBeforeHide"
          @show="onShow"
          @hide="onHide"
        >
          <me-button>事件演示</me-button>
        </me-tooltip>
      </div>
      <div class="play-event-log">
        <span class="play-label">事件日志：</span>
        <div class="play-event-log-list">
          <p v-for="(log, index) in eventLogs" :key="index">{{ log }}</p>
          <p v-if="eventLogs.length === 0" class="play-event-log-empty">暂无事件，请操作上方按钮</p>
        </div>
        <me-button size="small" @click="eventLogs = []">清空日志</me-button>
      </div>
    </section>

    <!-- 方法调用 -->
    <section class="play-section">
      <h2>方法调用</h2>
      <p class="play-desc">通过 ref 调用组件暴露的 show / hide / updatePopper 方法</p>
      <div class="play-demo-row">
        <me-tooltip ref="tooltipRef" content="通过方法控制的提示">
          <me-button>方法调用目标</me-button>
        </me-tooltip>
        <me-button type="primary" @click="handleShow">show()</me-button>
        <me-button @click="handleHide">hide()</me-button>
        <me-button @click="handleUpdatePopper">updatePopper()</me-button>
      </div>
    </section>

    <!-- 包裹不同元素 -->
    <section class="play-section">
      <h2>包裹不同元素</h2>
      <p class="play-desc">Tooltip 可以包裹任意元素，如文字、图标、链接等</p>
      <div class="play-demo-row">
        <me-tooltip content="包裹纯文字">
          <span class="play-text-trigger">鼠标悬停这段文字</span>
        </me-tooltip>
        <me-tooltip content="包裹链接元素">
          <a class="play-link-trigger" href="javascript:void(0)">悬停这个链接</a>
        </me-tooltip>
        <me-tooltip content="包裹带样式的元素">
          <span class="play-badge-trigger">Badge</span>
        </me-tooltip>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { MeTooltip } from '../src/index';

/** 受控模式显示状态 */
const controlledVisible = ref(false);
/** 动态禁用状态 */
const isDisabled = ref(false);
/** Tooltip 组件引用 */
const tooltipRef = ref<InstanceType<typeof MeTooltip>>();
/** 事件日志 */
const eventLogs = ref<string[]>([]);

/** 切换禁用状态 */
function toggleDisabled() {
  isDisabled.value = !isDisabled.value;
}

/** 添加事件日志 */
function addLog(message: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  eventLogs.value.unshift(`[${time}] ${message}`);
  if (eventLogs.value.length > 20) {
    eventLogs.value.pop();
  }
}

/** before-show 事件 */
function onBeforeShow() {
  addLog('before-show: 即将显示');
}

/** before-hide 事件 */
function onBeforeHide() {
  addLog('before-hide: 即将隐藏');
}

/** show 事件 */
function onShow() {
  addLog('show: 已显示');
}

/** hide 事件 */
function onHide() {
  addLog('hide: 已隐藏');
}

/** 通过 ref 调用 show */
function handleShow() {
  tooltipRef.value?.show();
}

/** 通过 ref 调用 hide */
function handleHide() {
  tooltipRef.value?.hide();
}

/** 通过 ref 调用 updatePopper */
function handleUpdatePopper() {
  tooltipRef.value?.updatePopper();
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

.play-label {
  font-size: 13px;
  color: #909399;
  white-space: nowrap;
}

.play-demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 8px;

  > * {
    margin-right: 12px;
    margin-bottom: 8px;
  }
}

.play-placement-grid {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.play-placement-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  > * {
    margin-right: 12px;
  }
}

.play-custom-content {
  padding: 4px 0;
}

.play-custom-content-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.play-custom-content-desc {
  font-size: 12px;
  line-height: 1.6;
  color: #c0c4cc;
}

.play-text-trigger {
  color: #409eff;
  cursor: pointer;
  border-bottom: 1px dashed #409eff;
}

.play-link-trigger {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}

.play-badge-trigger {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  color: #fff;
  background-color: #f56c6c;
  border-radius: 4px;
  cursor: pointer;
}

.play-event-log {
  margin-top: 12px;
}

.play-event-log-list {
  margin: 8px 0;
  padding: 12px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.8;
  color: #606266;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.play-event-log-empty {
  color: #c0c4cc;
}
</style>

<style lang="less">
/* 自定义弹出层样式（非 scoped） */
.play-custom-tooltip {
  border-color: #67c23a !important;
  color: #67c23a !important;
}
</style>
