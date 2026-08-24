<!-- ? tabindex 效果演示 -->
<template>
  <div class="tabindex-demo">
    <h2>tabindex 效果演示</h2>

    <div class="demo-row">
      <label>普通 div（无 tabindex）</label>
      <div class="demo-box" @mousedown="logEvent('div-no-tabindex mousedown')" @focus="logEvent('div-no-tabindex focus')" @blur="logEvent('div-no-tabindex blur')">
        点击我（不可聚焦）
      </div>
    </div>

    <div class="demo-row">
      <label>div tabindex="-1"</label>
      <div
        class="demo-box"
        tabindex="-1"
        @mousedown="logEvent('div-tabindex-1 mousedown')"
        @focus="logEvent('div-tabindex-1 focus')"
        @blur="logEvent('div-tabindex-1 blur')"
      >
        点击我（可聚焦，mousedown 会抢焦点）
      </div>
    </div>

    <div class="demo-row">
      <label>div tabindex="-1" + mousedown.prevent</label>
      <div
        class="demo-box"
        tabindex="-1"
        @mousedown.prevent="logEvent('div-tabindex-1-prevent mousedown')"
        @focus="logEvent('div-tabindex-1-prevent focus')"
        @blur="logEvent('div-tabindex-1-prevent blur')"
      >
        点击我（可聚焦，但 mousedown 被阻止，不抢焦点）
      </div>
    </div>

    <div class="demo-row">
      <label>input（当前焦点）</label>
      <input
        ref="inputRef"
        class="demo-input"
        @focus="logEvent('input focus')"
        @blur="logEvent('input blur')"
        placeholder="先点击我聚焦"
      />
    </div>

    <div class="demo-log">
      <button @click="logs = []">清空日志</button>
      <div class="demo-log-list">
        <p v-for="(log, i) in logs" :key="i">{{ log }}</p>
        <p v-if="logs.length === 0" class="demo-log-empty">先点击 input 聚焦，再点击上方三个 div 观察日志</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** input 引用 */
const inputRef = ref<HTMLInputElement>();

/** 日志列表 */
const logs = ref<string[]>([]);

/** 记录事件 */
function logEvent(message: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
  logs.value.unshift(`[${time}] ${message}`);
  if (logs.value.length > 20) logs.value.pop();
}
</script>

<style lang="less" scoped>
.tabindex-demo {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  h2 {
    font-size: 18px;
    margin-bottom: 20px;
  }
}

.demo-row {
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 13px;
    color: #909399;
    margin-bottom: 6px;
  }
}

.demo-box {
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #409eff;
  }

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    outline: none;
  }
}

.demo-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }
}

.demo-log {
  margin-top: 24px;

  button {
    padding: 4px 12px;
    font-size: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    margin-bottom: 8px;

    &:hover {
      border-color: #409eff;
      color: #409eff;
    }
  }
}

.demo-log-list {
  padding: 12px;
  max-height: 240px;
  overflow-y: auto;
  background-color: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.8;
  color: #606266;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.demo-log-empty {
  color: #c0c4cc;
}
</style>
