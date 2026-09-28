<!-- MeButton 按钮组件完整功能示例 -->
<template>
  <div class="play-button">
    <h1>MeButton 按钮组件示例</h1>

    <!-- ==================== 类型 ==================== -->

    <!-- 按钮类型 -->
    <section class="play-section">
      <h2>按钮类型</h2>
      <p class="play-desc">通过 type 设置按钮类型：default / primary / success / warning / danger / info</p>
      <div class="play-row">
        <me-button>Default</me-button>
        <me-button type="primary">Primary</me-button>
        <me-button type="success">Success</me-button>
        <me-button type="warning">Warning</me-button>
        <me-button type="danger">Danger</me-button>
        <me-button type="info">Info</me-button>
      </div>
    </section>

    <!-- 朴素按钮 -->
    <section class="play-section">
      <h2>朴素按钮</h2>
      <p class="play-desc">设置 plain 显示为朴素样式</p>
      <div class="play-row">
        <me-button plain>Default</me-button>
        <me-button type="primary" plain>Primary</me-button>
        <me-button type="success" plain>Success</me-button>
        <me-button type="warning" plain>Warning</me-button>
        <me-button type="danger" plain>Danger</me-button>
        <me-button type="info" plain>Info</me-button>
      </div>
    </section>

    <!-- ==================== 尺寸 ==================== -->

    <!-- 按钮尺寸 -->
    <section class="play-section">
      <h2>按钮尺寸</h2>
      <p class="play-desc">通过 size 设置尺寸：large / default / small</p>
      <div class="play-row">
        <me-button type="primary" size="large">Large</me-button>
        <me-button type="primary">Default</me-button>
        <me-button type="primary" size="small">Small</me-button>
      </div>
    </section>

    <!-- ==================== 形状 ==================== -->

    <!-- 圆角按钮 -->
    <section class="play-section">
      <h2>圆角按钮</h2>
      <p class="play-desc">设置 round 显示为圆角按钮</p>
      <div class="play-row">
        <me-button round>Default</me-button>
        <me-button type="primary" round>Primary</me-button>
        <me-button type="success" round>Success</me-button>
        <me-button type="warning" round>Warning</me-button>
        <me-button type="danger" round>Danger</me-button>
        <me-button type="info" round>Info</me-button>
      </div>
    </section>

    <!-- 圆形按钮 -->
    <section class="play-section">
      <h2>圆形按钮</h2>
      <p class="play-desc">设置 circle 显示为圆形按钮，通常配合图标使用</p>
      <div class="play-row">
        <me-button circle><me-icon><Search /></me-icon></me-button>
        <me-button type="primary" circle><me-icon><Edit /></me-icon></me-button>
        <me-button type="success" circle><me-icon><Check /></me-icon></me-button>
        <me-button type="warning" circle><me-icon><Star /></me-icon></me-button>
        <me-button type="danger" circle><me-icon><Delete /></me-icon></me-button>
        <me-button type="info" circle><me-icon><Share /></me-icon></me-button>
      </div>
    </section>

    <!-- ==================== 状态 ==================== -->

    <!-- 禁用状态 -->
    <section class="play-section">
      <h2>禁用状态</h2>
      <p class="play-desc">设置 disabled 禁用按钮，禁用后点击事件不会触发</p>
      <div class="play-row">
        <me-button disabled>Default</me-button>
        <me-button type="primary" disabled>Primary</me-button>
        <me-button type="success" disabled>Success</me-button>
        <me-button type="warning" disabled>Warning</me-button>
        <me-button type="danger" disabled>Danger</me-button>
        <me-button type="info" disabled>Info</me-button>
      </div>
      <div class="play-row">
        <me-button disabled plain>Default</me-button>
        <me-button type="primary" disabled plain>Primary</me-button>
        <me-button type="success" disabled plain>Success</me-button>
        <me-button type="warning" disabled plain>Warning</me-button>
        <me-button type="danger" disabled plain>Danger</me-button>
        <me-button type="info" disabled plain>Info</me-button>
      </div>
    </section>

    <!-- 加载状态 -->
    <section class="play-section">
      <h2>加载状态</h2>
      <p class="play-desc">设置 loading 显示加载图标并阻止点击</p>
      <div class="play-row">
        <me-button loading>Default</me-button>
        <me-button type="primary" loading>Primary</me-button>
        <me-button type="success" loading>Success</me-button>
        <me-button type="danger" loading>Danger</me-button>
      </div>
    </section>

    <!-- 自定义加载图标 -->
    <section class="play-section">
      <h2>自定义加载图标</h2>
      <p class="play-desc">通过 loading 插槽自定义加载图标</p>
      <div class="play-row">
        <me-button type="primary" loading>
          <template #loading><Refresh /></template>
          加载中
        </me-button>
      </div>
    </section>

    <!-- 模拟异步提交 -->
    <section class="play-section">
      <h2>模拟异步提交</h2>
      <p class="play-desc">点击按钮进入 loading 状态，2 秒后恢复</p>
      <div class="play-row">
        <me-button type="primary" :loading="submitting" @click="onSubmit">
          {{ submitting ? "提交中..." : "提交" }}
        </me-button>
        <me-button :loading="submitting" @click="onSubmit">同步禁用</me-button>
      </div>
    </section>

    <!-- ==================== 事件 ==================== -->

    <!-- 点击事件 -->
    <section class="play-section">
      <h2>点击事件</h2>
      <p class="play-desc">监听 click 事件</p>
      <div class="play-row">
        <me-button type="primary" @click="onClick">点我</me-button>
      </div>
      <div v-if="clickLog" class="play-log">{{ clickLog }}</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { message } from "ant-design-vue";
import {
  Search,
  Edit,
  Check,
  Star,
  Delete,
  Share,
  Refresh,
} from "@element-plus/icons-vue";

/** 提交中状态 */
const submitting = ref(false);
/** 点击日志 */
const clickLog = ref("");

function onSubmit() {
  submitting.value = true;
  setTimeout(() => {
    submitting.value = false;
    message.success("提交完成");
  }, 2000);
}

function onClick(evt: MouseEvent) {
  clickLog.value = `click 触发，坐标: (${evt.clientX}, ${evt.clientY})`;
  message.info("点击了按钮");
}
</script>

<style scoped>
.play-button {
  padding: 24px;
}
.play-section {
  margin-bottom: 32px;
}
.play-desc {
  color: #888;
  font-size: 13px;
  margin-bottom: 8px;
}
.play-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}
.play-log {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  color: #555;
}
</style>
