<!-- MeTypewriter 打字机组件完整功能示例 -->
<template>
  <div class="play-typewriter">
    <h1>MeTypewriter 打字机组件示例</h1>

    <!-- ==================== 基础用法 ==================== -->

    <!-- 自动开始 -->
    <section class="play-section">
      <h2>基础用法（自动开始）</h2>
      <p class="play-desc">设置 auto-start 后组件挂载即开始打字，完成后光标继续闪烁</p>
      <me-typewriter text="春江潮水连海平，海上明月共潮生。" auto-start />
    </section>

    <!-- 打字速度 -->
    <section class="play-section">
      <h2>打字速度</h2>
      <p class="play-desc">通过 speed 设置每个字符的间隔（单位：ms），值越小越快</p>
      <div class="play-row" style="flex-direction: column; align-items: flex-start">
        <me-typewriter text="慢速打字 speed=200" :speed="200" auto-start />
        <me-typewriter text="默认速度 speed=50" auto-start />
        <me-typewriter text="快速打字 speed=10" :speed="10" auto-start />
      </div>
    </section>

    <!-- emoji / 代理对字符 -->
    <section class="play-section">
      <h2>Emoji 与代理对字符</h2>
      <p class="play-desc">按 code point 切分，emoji 不会被切成乱码</p>
      <me-typewriter text="你好 👋 世界 🌍🎉 𠮷野家" :speed="150" auto-start />
    </section>

    <!-- ==================== 布局 ==================== -->

    <!-- 独占一行 -->
    <section class="play-section">
      <h2>独占一行</h2>
      <p class="play-desc">block 默认为 true（独占一行），设为 false 后与前后文本行内排列</p>
      <p>
        前方文本
        <me-typewriter text="行内打字机" :block="false" :speed="80" auto-start />
        后方文本
      </p>
    </section>

    <!-- ==================== 光标 ==================== -->

    <!-- 光标配置 -->
    <section class="play-section">
      <h2>光标配置</h2>
      <p class="play-desc">通过 cursor-symbol 自定义光标符号，show-cursor=false 隐藏光标</p>
      <div class="play-row" style="flex-direction: column; align-items: flex-start">
        <me-typewriter text="默认光标 |" :speed="80" auto-start />
        <me-typewriter text="下划线光标" cursor-symbol="_" :speed="80" auto-start />
        <me-typewriter text="方块光标" cursor-symbol="▌" :speed="80" auto-start />
        <me-typewriter text="无光标" :show-cursor="false" :speed="80" auto-start />
      </div>
    </section>

    <!-- ==================== 循环 ==================== -->

    <!-- 循环打字 -->
    <section class="play-section">
      <h2>循环打字</h2>
      <p class="play-desc">设置 loop 后打完自动清空重新打</p>
      <me-typewriter text="这段文字会循环播放，打完即清空重新开始。" :speed="80" loop auto-start />
    </section>

    <!-- ==================== 手动控制 ==================== -->

    <!-- 实例方法控制 -->
    <section class="play-section">
      <h2>手动控制（expose 方法）</h2>
      <p class="play-desc">
        不设置 auto-start，通过 ref 调用 start / stop / reStart / complete / delete
      </p>
      <me-typewriter ref="typewriterRef" :text="manualText" :speed="60" />
      <div class="play-row" style="margin-top: 12px">
        <me-button type="primary" @click="typewriterRef?.start()">开始</me-button>
        <me-button @click="typewriterRef?.stop()">停止</me-button>
        <me-button @click="typewriterRef?.reStart()">重新打字</me-button>
        <me-button type="success" @click="typewriterRef?.complete()">立即完成</me-button>
        <me-button type="danger" @click="typewriterRef?.delete()">逐字删除</me-button>
      </div>
      <div class="play-log">当前已显示：{{ typewriterRef?.text }}</div>
    </section>

    <!-- ==================== 禁用 ==================== -->

    <!-- 禁用状态 -->
    <section class="play-section">
      <h2>禁用状态</h2>
      <p class="play-desc">disabled 时直接显示完整文案、不播放动画；运行中切换会停止并显示全文</p>
      <div class="play-row">
        <label style="display: flex; align-items: center">
          <input v-model="isDisabled" type="checkbox" />
          <span style="margin-left: 6px">切换 disabled：{{ isDisabled }}</span>
        </label>
      </div>
      <me-typewriter text="禁用期间这段文字直接完整显示。" :speed="80" :disabled="isDisabled" auto-start />
    </section>

    <!-- ==================== 动态文本 ==================== -->

    <!-- 动态 text -->
    <section class="play-section">
      <h2>动态文案</h2>
      <p class="play-desc">auto-start 模式下 text 变化会自动重新打字</p>
      <div class="play-row">
        <me-button @click="dynamicText = '第一句：长太息以掩涕兮，哀民生之多艰。'">
          文案一
        </me-button>
        <me-button @click="dynamicText = '第二句：路漫漫其修远兮，吾将上下而求索。'">
          文案二
        </me-button>
        <me-button @click="dynamicText = '第三句：亦余心之所善兮，虽九死其犹未悔。'">
          文案三
        </me-button>
      </div>
      <me-typewriter :text="dynamicText" :speed="60" auto-start />
    </section>

    <!-- ==================== 插槽 ==================== -->

    <!-- 自定义插槽 -->
    <section class="play-section">
      <h2>自定义渲染（slot）</h2>
      <p class="play-desc">通过默认插槽的 displayText 自定义渲染，例如高亮或富文本</p>
      <me-typewriter text="slot 渲染的文字自带高亮样式" :speed="100" auto-start>
        <template #default="{ displayText }">
          <span class="highlight-text">{{ displayText }}</span>
        </template>
      </me-typewriter>
    </section>

    <!-- ==================== 事件 ==================== -->

    <!-- 事件监听 -->
    <section class="play-section">
      <h2>事件监听</h2>
      <p class="play-desc">start（正向开始）/ delete（反向删除开始）/ stop / complete / display / clear 六个事件</p>
      <div class="play-row">
        <me-button type="primary" @click="eventRef?.start()">开始</me-button>
        <me-button @click="eventRef?.stop()">停止</me-button>
        <me-button type="success" @click="eventRef?.complete()">完成</me-button>
        <me-button type="danger" @click="eventRef?.delete()">删除</me-button>
        <me-button @click="eventLogs = []">清空日志</me-button>
      </div>
      <me-typewriter
        ref="eventRef"
        text="观察下方事件日志输出"
        :speed="100"
        @start="pushLog('start')"
        @delete="pushLog('delete')"
        @stop="pushLog('stop')"
        @complete="pushLog('complete')"
        @display="onDisplay"
        @clear="pushLog('clear')"
      />
      <div class="play-log" style="max-height: 160px; overflow: auto">
        <div v-for="(log, i) in eventLogs" :key="i">{{ log }}</div>
        <div v-if="!eventLogs.length">暂无事件</div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { MeTypewriter } from '../src/components/typewriter';

/** 手动控制实例 */
const typewriterRef = ref<InstanceType<typeof MeTypewriter>>();
/** 手动控制文案 */
const manualText = ref('这段文字通过 ref 上的方法手动控制播放。');

/** 是否禁用 */
const isDisabled = ref(false);

/** 动态文案 */
const dynamicText = ref('第一句：长太息以掩涕兮，哀民生之多艰。');

/** 事件示例实例 */
const eventRef = ref<InstanceType<typeof MeTypewriter>>();
/** 事件日志 */
const eventLogs = ref<string[]>([]);

/** 记录事件日志 */
function pushLog(name: string) {
  eventLogs.value.push(`[${new Date().toLocaleTimeString()}] ${name}`);
}

/** display 事件（只记录长度，避免刷屏） */
function onDisplay(text: string) {
  eventLogs.value.push(`display: "${text}"`);
}
</script>

<style scoped>
.play-typewriter {
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
.highlight-text {
  color: #e6a23c;
  font-weight: 600;
  background: #fdf6ec;
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
