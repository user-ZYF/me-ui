<!-- event.target 与 event.relatedTarget 对比示例 -->
<template>
  <div class="play-root">
    <h1>event.target 与 event.relatedTarget 对比示例</h1>

    <!-- 概念说明 -->
    <section class="play-section">
      <h2>概念说明</h2>
      <div class="play-concept-grid">
        <div class="play-concept-card play-concept-card-target">
          <h3>event.target</h3>
          <p>事件真正发生的元素，即事件当前绑定的元素（事件冒泡/捕获的目标）。</p>
          <ul>
            <li>在 <code>focus</code> 事件中：获得焦点的元素</li>
            <li>在 <code>blur</code> 事件中：失去焦点的元素</li>
            <li>在 <code>mouseenter</code> 事件中：鼠标进入的元素</li>
            <li>在 <code>mouseleave</code> 事件中：鼠标离开的元素</li>
          </ul>
        </div>
        <div class="play-concept-card play-concept-card-related">
          <h3>event.relatedTarget</h3>
          <p>事件的「另一端」元素，即与当前操作相关联的元素。</p>
          <ul>
            <li>在 <code>focus</code> 事件中：之前拥有焦点的元素（失去焦点的元素）</li>
            <li>在 <code>blur</code> 事件中：即将获得焦点的元素</li>
            <li>在 <code>mouseenter</code> 事件中：鼠标来自的元素</li>
            <li>在 <code>mouseleave</code> 事件中：鼠标去往的元素</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Focus / Blur 事件演示 -->
    <section class="play-section">
      <h2>Focus / Blur 事件演示</h2>
      <p class="play-desc">在以下输入框之间切换焦点，观察 target 和 relatedTarget 的变化</p>

      <div class="play-focus-area" @click="onAreaClick">
        <div class="play-focus-row">
          <label class="play-focus-label">输入框 A：</label>
          <input
            ref="inputARef"
            class="play-input"
            placeholder="点击我获取焦点"
            @focus="onFocus($event, 'A')"
            @blur="onBlur($event, 'A')"
          />
        </div>
        <div class="play-focus-row">
          <label class="play-focus-label">输入框 B：</label>
          <input
            ref="inputBRef"
            class="play-input"
            placeholder="点击我获取焦点"
            @focus="onFocus($event, 'B')"
            @blur="onBlur($event, 'B')"
          />
        </div>
        <div class="play-focus-row">
          <label class="play-focus-label">输入框 C：</label>
          <input
            ref="inputCRef"
            class="play-input"
            placeholder="点击我获取焦点"
            @focus="onFocus($event, 'C')"
            @blur="onBlur($event, 'C')"
          />
        </div>
      </div>

      <div class="play-event-log">
        <div class="play-event-log-header">
          <span class="play-label">Focus/Blur 事件日志：</span>
          <button class="play-clear-btn" @click="focusLogs = []">清空</button>
        </div>
        <div class="play-event-log-list">
          <div v-for="(log, index) in focusLogs" :key="index" class="play-log-item" :class="log.className">
            <span class="play-log-time">{{ log.time }}</span>
            <span class="play-log-type">{{ log.type }}</span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-target">target</span>
              {{ log.target }}
            </span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-related">relatedTarget</span>
              {{ log.relatedTarget }}
            </span>
          </div>
          <p v-if="focusLogs.length === 0" class="play-event-log-empty">暂无事件，请在输入框之间切换焦点</p>
        </div>
      </div>
    </section>

    <!-- Mouseenter / Mouseleave 事件演示 -->
    <section class="play-section">
      <h2>Mouseenter / Mouseleave 事件演示</h2>
      <p class="play-desc">将鼠标在以下区域之间移动，观察 target 和 relatedTarget 的变化</p>

      <div class="play-mouse-area">
        <div
          class="play-mouse-box play-mouse-box-outer"
          @mouseenter="onMouseEnter($event, '外层')"
          @mouseleave="onMouseLeave($event, '外层')"
        >
          外层区域（mouseenter / mouseleave）
          <div
            class="play-mouse-box play-mouse-box-inner"
            @mouseenter="onMouseEnter($event, '内层')"
            @mouseleave="onMouseLeave($event, '内层')"
          >
            内层区域
          </div>
        </div>
      </div>

      <div class="play-event-log">
        <div class="play-event-log-header">
          <span class="play-label">Mouseenter/Mouseleave 事件日志：</span>
          <button class="play-clear-btn" @click="mouseLogs = []">清空</button>
        </div>
        <div class="play-event-log-list">
          <div v-for="(log, index) in mouseLogs" :key="index" class="play-log-item" :class="log.className">
            <span class="play-log-time">{{ log.time }}</span>
            <span class="play-log-type">{{ log.type }}</span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-target">target</span>
              {{ log.target }}
            </span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-related">relatedTarget</span>
              {{ log.relatedTarget }}
            </span>
          </div>
          <p v-if="mouseLogs.length === 0" class="play-event-log-empty">暂无事件，请将鼠标移入上方区域</p>
        </div>
      </div>
    </section>

    <!-- Mouseover / Mouseout 事件演示（对比 mouseenter/mouseleave） -->
    <section class="play-section">
      <h2>Mouseover / Mouseout 事件演示（冒泡对比）</h2>
      <p class="play-desc">mouseover/mouseout 会冒泡，mouseenter/mouseleave 不会。观察冒泡时的 target 变化</p>

      <div class="play-mouse-area">
        <div
          class="play-mouse-box play-mouse-box-outer"
          @mouseover="onMouseOver($event, '外层')"
          @mouseout="onMouseOut($event, '外层')"
        >
          外层区域（mouseover / mouseout）
          <div
            class="play-mouse-box play-mouse-box-inner"
            @mouseover="onMouseOver($event, '内层')"
            @mouseout="onMouseOut($event, '内层')"
          >
            内层区域
          </div>
        </div>
      </div>

      <div class="play-event-log">
        <div class="play-event-log-header">
          <span class="play-label">Mouseover/Mouseout 事件日志：</span>
          <button class="play-clear-btn" @click="mouseOverLogs = []">清空</button>
        </div>
        <div class="play-event-log-list">
          <div v-for="(log, index) in mouseOverLogs" :key="index" class="play-log-item" :class="log.className">
            <span class="play-log-time">{{ log.time }}</span>
            <span class="play-log-type">{{ log.type }}</span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-target">target</span>
              {{ log.target }}
            </span>
            <span class="play-log-detail">
              <span class="play-log-tag play-log-tag-related">relatedTarget</span>
              {{ log.relatedTarget }}
            </span>
          </div>
          <p v-if="mouseOverLogs.length === 0" class="play-event-log-empty">暂无事件，请将鼠标移入上方区域</p>
        </div>
      </div>
    </section>

    <!-- 实际应用场景 -->
    <section class="play-section">
      <h2>实际应用场景：Tooltip 焦点判断</h2>
      <p class="play-desc">
        在 Tooltip 组件中，当触发方式为 focus 时，需要判断焦点是否从触发元素移到了弹出层内部。
        此时 <code>blur</code> 事件的 <code>relatedTarget</code> 指向即将获得焦点的元素，
        通过检查 <code>relatedTarget</code> 是否在弹出层内，可以决定是否关闭 Tooltip。
      </p>

      <div class="play-tooltip-demo">
        <button
          ref="tooltipTriggerRef"
          class="play-tooltip-trigger"
          @focus="onTooltipTriggerFocus"
          @blur="onTooltipTriggerBlur"
        >
          点击我聚焦（模拟 Tooltip 触发元素）
        </button>

        <div
          v-show="tooltipVisible"
          ref="tooltipContentRef"
          class="play-tooltip-content"
          @focusin="onTooltipContentFocusIn"
        >
          <p>这是 Tooltip 弹出层内容</p>
          <input class="play-input play-tooltip-input" placeholder="弹出层内的输入框" />
          <button class="play-tooltip-inner-btn">弹出层内的按钮</button>
        </div>
      </div>

      <div class="play-event-log">
        <div class="play-event-log-header">
          <span class="play-label">Tooltip 焦点事件日志：</span>
          <button class="play-clear-btn" @click="tooltipLogs = []">清空</button>
        </div>
        <div class="play-event-log-list">
          <div v-for="(log, index) in tooltipLogs" :key="index" class="play-log-item" :class="log.className">
            <span class="play-log-time">{{ log.time }}</span>
            <span class="play-log-type">{{ log.type }}</span>
            <span class="play-log-detail">{{ log.detail }}</span>
          </div>
          <p v-if="tooltipLogs.length === 0" class="play-event-log-empty">暂无事件，请聚焦上方按钮</p>
        </div>
      </div>
    </section>

    <!-- 总结对比表 -->
    <section class="play-section">
      <h2>总结对比表</h2>
      <table class="play-table">
        <thead>
          <tr>
            <th>事件类型</th>
            <th>event.target</th>
            <th>event.relatedTarget</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>focus</code></td>
            <td>获得焦点的元素</td>
            <td>失去焦点的元素（之前聚焦的元素）</td>
          </tr>
          <tr>
            <td><code>blur</code></td>
            <td>失去焦点的元素</td>
            <td>即将获得焦点的元素</td>
          </tr>
          <tr>
            <td><code>focusin</code></td>
            <td>获得焦点的元素（冒泡）</td>
            <td>失去焦点的元素</td>
          </tr>
          <tr>
            <td><code>focusout</code></td>
            <td>失去焦点的元素（冒泡）</td>
            <td>即将获得焦点的元素</td>
          </tr>
          <tr>
            <td><code>mouseenter</code></td>
            <td>鼠标进入的元素</td>
            <td>鼠标来自的元素</td>
          </tr>
          <tr>
            <td><code>mouseleave</code></td>
            <td>鼠标离开的元素</td>
            <td>鼠标去往的元素</td>
          </tr>
          <tr>
            <td><code>mouseover</code></td>
            <td>鼠标进入的元素（冒泡）</td>
            <td>鼠标来自的元素</td>
          </tr>
          <tr>
            <td><code>mouseout</code></td>
            <td>鼠标离开的元素（冒泡）</td>
            <td>鼠标去往的元素</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** 日志项 */
interface LogItem {
  /** 时间戳 */
  time: string;
  /** 事件类型 */
  type: string;
  /** target 描述 */
  target: string;
  /** relatedTarget 描述 */
  relatedTarget: string;
  /** 样式类名 */
  className: string;
}

/** Tooltip 日志项 */
interface TooltipLogItem {
  /** 时间戳 */
  time: string;
  /** 事件类型 */
  type: string;
  /** 详情 */
  detail: string;
  /** 样式类名 */
  className: string;
}

/** 输入框 A 引用 */
const inputARef = ref<HTMLInputElement>();
/** 输入框 B 引用 */
const inputBRef = ref<HTMLInputElement>();
/** 输入框 C 引用 */
const inputCRef = ref<HTMLInputElement>();

/** Focus/Blur 事件日志 */
const focusLogs = ref<LogItem[]>([]);
/** Mouseenter/Mouseleave 事件日志 */
const mouseLogs = ref<LogItem[]>([]);
/** Mouseover/Mouseout 事件日志 */
const mouseOverLogs = ref<LogItem[]>([]);
/** Tooltip 焦点事件日志 */
const tooltipLogs = ref<TooltipLogItem[]>([]);

/** Tooltip 显示状态 */
const tooltipVisible = ref(false);
/** Tooltip 触发元素引用 */
const tooltipTriggerRef = ref<HTMLButtonElement>();
/** Tooltip 内容元素引用 */
const tooltipContentRef = ref<HTMLDivElement>();

/** 获取当前时间字符串 */
function getTime(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

/** 获取元素描述 */
function getElementDesc(el: EventTarget | null): string {
  if (!el) return 'null';
  if (el === document.body) return 'document.body';
  if (el === document.documentElement) return 'document.documentElement';
  const element = el as HTMLElement;
  if (element.tagName === 'INPUT') {
    const label = element.previousElementSibling?.textContent || '';
    return `<input> (${label})`;
  }
  if (element.className) {
    return `<${element.tagName.toLowerCase()}> .${element.className.split(' ')[0]}`;
  }
  return `<${element.tagName.toLowerCase()}>`;
}

/** 添加 Focus/Blur 日志 */
function addFocusLog(type: string, event: FocusEvent, source: string) {
  const log: LogItem = {
    time: getTime(),
    type: `${type} [${source}]`,
    target: getElementDesc(event.target),
    relatedTarget: getElementDesc(event.relatedTarget),
    className: type === 'focus' ? 'play-log-item-focus' : 'play-log-item-blur',
  };
  focusLogs.value.unshift(log);
  if (focusLogs.value.length > 30) focusLogs.value.pop();
}

/** 添加 Mouse 日志 */
function addMouseLog(list: typeof mouseLogs, type: string, event: MouseEvent, source: string) {
  const log: LogItem = {
    time: getTime(),
    type: `${type} [${source}]`,
    target: getElementDesc(event.target),
    relatedTarget: getElementDesc(event.relatedTarget),
    className: type.includes('enter') || type.includes('over')
      ? 'play-log-item-enter'
      : 'play-log-item-leave',
  };
  list.value.unshift(log);
  if (list.value.length > 30) list.value.pop();
}

/** 添加 Tooltip 日志 */
function addTooltipLog(type: string, detail: string, className: string) {
  const log: TooltipLogItem = {
    time: getTime(),
    type,
    detail,
    className,
  };
  tooltipLogs.value.unshift(log);
  if (tooltipLogs.value.length > 30) tooltipLogs.value.pop();
}

/** Focus 事件处理 */
function onFocus(event: FocusEvent, source: string) {
  addFocusLog('focus', event, source);
}

/** Blur 事件处理 */
function onBlur(event: FocusEvent, source: string) {
  addFocusLog('blur', event, source);
}

/** Mouseenter 事件处理 */
function onMouseEnter(event: MouseEvent, source: string) {
  addMouseLog(mouseLogs, 'mouseenter', event, source);
}

/** Mouseleave 事件处理 */
function onMouseLeave(event: MouseEvent, source: string) {
  addMouseLog(mouseLogs, 'mouseleave', event, source);
}

/** Mouseover 事件处理 */
function onMouseOver(event: MouseEvent, source: string) {
  addMouseLog(mouseOverLogs, 'mouseover', event, source);
}

/** Mouseout 事件处理 */
function onMouseOut(event: MouseEvent, source: string) {
  addMouseLog(mouseOverLogs, 'mouseout', event, source);
}

/** 点击区域聚焦 A */
function onAreaClick() {
  // 空函数，仅用于区域点击交互
}

/** Tooltip 触发元素 focus */
function onTooltipTriggerFocus(event: FocusEvent) {
  tooltipVisible.value = true;
  addTooltipLog(
    'trigger focus',
    `target: ${getElementDesc(event.target)} | relatedTarget: ${getElementDesc(event.relatedTarget)}`,
    'play-log-item-focus',
  );
}

/** Tooltip 触发元素 blur */
function onTooltipTriggerBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as Node | null;
  const isInsideContent = tooltipContentRef.value?.contains(relatedTarget);

  addTooltipLog(
    'trigger blur',
    `target: ${getElementDesc(event.target)} | relatedTarget: ${getElementDesc(event.relatedTarget)} | 焦点在弹出层内: ${isInsideContent}`,
    isInsideContent ? 'play-log-item-info' : 'play-log-item-blur',
  );

  if (!isInsideContent) {
    tooltipVisible.value = false;
    addTooltipLog('tooltip 关闭', '焦点不在弹出层内，关闭 Tooltip', 'play-log-item-leave');
  } else {
    addTooltipLog('tooltip 保持', '焦点移入了弹出层内，保持 Tooltip 显示', 'play-log-item-enter');
  }
}

/** Tooltip 内容区域 focusin */
function onTooltipContentFocusIn(event: FocusEvent) {
  addTooltipLog(
    'content focusin',
    `target: ${getElementDesc(event.target)} | relatedTarget: ${getElementDesc(event.relatedTarget)}`,
    'play-log-item-enter',
  );
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
    color: #303133;
  }

  h3 {
    font-size: 15px;
    margin-bottom: 8px;
  }

  code {
    padding: 2px 6px;
    font-size: 13px;
    background-color: #f0f0f0;
    border-radius: 3px;
    font-family: 'Fira Code', 'Consolas', monospace;
    color: #c41d7f;
  }
}

.play-section {
  margin-bottom: 32px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.play-desc {
  margin-bottom: 16px;
  font-size: 13px;
  color: #909399;
  line-height: 1.8;
}

.play-label {
  font-size: 13px;
  color: #909399;
  white-space: nowrap;
}

.play-concept-grid {
  display: flex;
  margin-bottom: 8px;
}

.play-concept-card {
  flex: 1;
  padding: 16px;
  border-radius: 8px;

  ul {
    padding-left: 20px;
    font-size: 13px;
    line-height: 2;
    color: #606266;
  }

  p {
    font-size: 13px;
    line-height: 1.8;
    color: #606266;
    margin-bottom: 8px;
  }
}

.play-concept-card-target {
  margin-right: 12px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;

  h3 {
    color: #409eff;
  }
}

.play-concept-card-related {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;

  h3 {
    color: #67c23a;
  }
}

.play-focus-area {
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fafafa;
  border-radius: 6px;
}

.play-focus-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.play-focus-label {
  width: 80px;
  font-size: 13px;
  color: #606266;
}

.play-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #409eff;
  }
}

.play-mouse-area {
  margin-bottom: 16px;
}

.play-mouse-box {
  padding: 20px;
  border: 2px dashed transparent;
  border-radius: 6px;
  transition: border-color 0.2s, background-color 0.2s;
  font-size: 13px;
}

.play-mouse-box-outer {
  border-color: #409eff;
  background-color: #ecf5ff;
  color: #409eff;

  &:hover {
    background-color: #d9ecff;
  }
}

.play-mouse-box-inner {
  margin-top: 12px;
  border-color: #67c23a;
  background-color: #f0f9eb;
  color: #67c23a;

  &:hover {
    background-color: #e1f3d8;
  }
}

.play-event-log {
  margin-top: 16px;
}

.play-event-log-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.play-clear-btn {
  margin-left: 12px;
  padding: 2px 10px;
  font-size: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    color: #409eff;
  }
}

.play-event-log-list {
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.play-event-log-empty {
  color: #c0c4cc;
  text-align: center;
}

.play-log-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin-bottom: 2px;
  border-radius: 3px;
  flex-wrap: wrap;
}

.play-log-item-focus {
  background-color: rgba(64, 158, 255, 0.08);
  border-left: 3px solid #409eff;
}

.play-log-item-blur {
  background-color: rgba(245, 108, 108, 0.08);
  border-left: 3px solid #f56c6c;
}

.play-log-item-enter {
  background-color: rgba(103, 194, 58, 0.08);
  border-left: 3px solid #67c23a;
}

.play-log-item-leave {
  background-color: rgba(230, 162, 60, 0.08);
  border-left: 3px solid #e6a23c;
}

.play-log-item-info {
  background-color: rgba(144, 147, 153, 0.08);
  border-left: 3px solid #909399;
}

.play-log-time {
  width: 80px;
  color: #909399;
}

.play-log-type {
  width: 200px;
  font-weight: 600;
  color: #303133;
}

.play-log-detail {
  margin-right: 16px;
  color: #606266;
}

.play-log-tag {
  display: inline-block;
  padding: 1px 6px;
  margin-right: 4px;
  font-size: 11px;
  border-radius: 3px;
}

.play-log-tag-target {
  background-color: #ecf5ff;
  color: #409eff;
}

.play-log-tag-related {
  background-color: #f0f9eb;
  color: #67c23a;
}

.play-tooltip-demo {
  margin-bottom: 16px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 6px;
}

.play-tooltip-trigger {
  padding: 8px 16px;
  font-size: 14px;
  border: 1px solid #409eff;
  border-radius: 4px;
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: 2px solid #a0cfff;
    outline-offset: 2px;
  }
}

.play-tooltip-content {
  margin-top: 12px;
  padding: 16px;
  background-color: #303133;
  color: #fff;
  border-radius: 6px;
  max-width: 300px;

  p {
    margin-bottom: 12px;
    font-size: 13px;
  }
}

.play-tooltip-input {
  max-width: none;
  margin-bottom: 12px;
  border-color: #606266;
  background-color: #606266;
  color: #fff;

  &::placeholder {
    color: #c0c4cc;
  }

  &:focus {
    border-color: #409eff;
  }
}

.play-tooltip-inner-btn {
  padding: 6px 12px;
  font-size: 13px;
  border: 1px solid #606266;
  border-radius: 4px;
  background-color: #606266;
  color: #fff;
  cursor: pointer;

  &:focus {
    outline: 2px solid #409eff;
    outline-offset: 2px;
  }
}

.play-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th,
  td {
    padding: 10px 12px;
    border: 1px solid #ebeef5;
    text-align: left;
  }

  th {
    background-color: #f5f7fa;
    color: #303133;
    font-weight: 600;
  }

  td {
    color: #606266;
  }

  tr:hover td {
    background-color: #f5f7fa;
  }
}
</style>
