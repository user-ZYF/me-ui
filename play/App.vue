<!-- ? Playground 调试页面 -->
<template>
  <div class="playground">
    <h1>Me UI Playground</h1>

    <section>
      <h2>ConfigProvider 自定义主题</h2>
      <div class="row">
        <label>主色：</label>
        <input type="color" v-model="primaryColor" />
        <span>{{ primaryColor }}</span>
      </div>
    </section>

    <MeConfigProvider :theme="theme" size="large">
      <section>
        <h2>Button 类型</h2>
        <div class="row">
          <me-button>Default</me-button>
          <me-button type="primary">Primary</me-button>
          <me-button type="success">Success</me-button>
          <me-button type="warning">Warning</me-button>
          <me-button type="danger">Danger</me-button>
          <me-button type="info">Info</me-button>
        </div>
      </section>

      <section>
        <h2>Button 尺寸</h2>
        <div class="row">
          <me-button size="large">Large</me-button>
          <me-button size="default">Default</me-button>
          <me-button size="small">Small</me-button>
        </div>
      </section>

      <section>
        <h2>Button 朴素</h2>
        <div class="row">
          <me-button plain>Default</me-button>
          <me-button type="primary" plain>Primary</me-button>
          <me-button type="success" plain>Success</me-button>
          <me-button type="danger" plain>Danger</me-button>
        </div>
      </section>

      <section>
        <h2>Button 圆角 / 圆形</h2>
        <div class="row">
          <me-button round>Round</me-button>
          <me-button type="primary" round>Primary Round</me-button>
          <me-button circle>C</me-button>
          <me-button type="primary" circle>P</me-button>
        </div>
      </section>

      <section>
        <h2>Button 禁用 / 加载</h2>
        <div class="row">
          <me-button disabled>Disabled</me-button>
          <me-button type="primary" disabled>Disabled Primary</me-button>
          <me-button loading>Loading</me-button>
          <me-button type="primary" loading>Loading Primary</me-button>
        </div>
      </section>
    </MeConfigProvider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import MeButton from '../src/components/button';
import MeConfigProvider from '../src/components/config-provider';

defineOptions({ name: 'PlaygroundApp' });

/** 自定义主色 */
const primaryColor = ref('#f56c6c');

/** 主题 Token 配置 */
const theme = computed(() => ({
  colorPrimary: primaryColor.value,
}));
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

.playground {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.playground h1 {
  color: #303133;
}

.playground section {
  margin-bottom: 32px;
}

.playground h2 {
  font-size: 16px;
  color: #606266;
  margin-bottom: 12px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.row > button {
  margin-right: 12px;
  margin-bottom: 12px;
}
</style>
