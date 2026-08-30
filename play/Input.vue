<!-- ? Input 输入框组件示例 -->
<template>
  <div class="play-input">
    <h1>MeInput 输入框</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">通过 v-model 双向绑定</p>
      <div class="play-border">
        <me-input v-model="basicValue" placeholder="请输入内容" />
        <p class="play-result">当前值：{{ basicValue }}</p>
      </div>
    </section>

    <!-- 不同类型 -->
    <section class="play-section">
      <h2>不同类型</h2>
      <p class="play-desc">text / password / number / email / tel / url</p>
      <div class="play-border play-flex">
        <me-input v-model="textValue" type="text" placeholder="text 类型" />
        <me-input v-model="numberValue" type="number" placeholder="number 类型" />
        <me-input v-model="emailValue" type="email" placeholder="email 类型" />
        <me-input v-model="telValue" type="tel" placeholder="tel 类型" />
        <me-input v-model="urlValue" type="url" placeholder="url 类型" />
      </div>
    </section>

    <!-- 密码框 -->
    <section class="play-section">
      <h2>密码框</h2>
      <p class="play-desc">设置 type="password" 和 showPassword 属性，可切换密码可见性</p>
      <div class="play-border">
        <me-input v-model="passwordValue" type="password" show-password placeholder="请输入密码" />
      </div>
    </section>

    <!-- 可清空 -->
    <section class="play-section">
      <h2>可清空</h2>
      <p class="play-desc">设置 clearable 属性，输入内容后可一键清空</p>
      <div class="play-border">
        <me-input v-model="clearableValue" clearable placeholder="请输入内容" />
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用状态</h2>
      <p class="play-desc">设置 disabled 属性</p>
      <div class="play-border">
        <me-input v-model="disabledValue" disabled placeholder="禁用状态" />
      </div>
    </section>

    <!-- 只读 -->
    <section class="play-section">
      <h2>只读状态</h2>
      <p class="play-desc">设置 readonly 属性</p>
      <div class="play-border">
        <me-input v-model="readonlyValue" readonly placeholder="只读状态" />
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="play-section">
      <h2>不同尺寸</h2>
      <p class="play-desc">large / default / small</p>
      <div class="play-border play-flex">
        <me-input v-model="sizeValue" size="large" placeholder="large 尺寸" />
        <me-input v-model="sizeValue" size="default" placeholder="default 尺寸" />
        <me-input v-model="sizeValue" size="small" placeholder="small 尺寸" />
      </div>
    </section>

    <!-- 前缀图标 -->
    <section class="play-section">
      <h2>前缀图标</h2>
      <p class="play-desc">通过 prefixIcon 属性设置前缀图标组件</p>
      <div class="play-border">
        <me-input v-model="prefixValue" :prefix-icon="Search" placeholder="搜索内容" />
      </div>
    </section>

    <!-- 后缀图标 -->
    <section class="play-section">
      <h2>后缀图标</h2>
      <p class="play-desc">通过 suffixIcon 属性设置后缀图标组件</p>
      <div class="play-border">
        <me-input v-model="suffixValue" :suffix-icon="Calendar" placeholder="选择日期" />
      </div>
    </section>

    <!-- 前置内容 -->
    <section class="play-section">
      <h2>前置内容</h2>
      <p class="play-desc">通过 #prepend 插槽设置前置内容</p>
      <div class="play-border">
        <me-input v-model="prependValue" placeholder="请输入网址">
          <template #prepend>https://</template>
        </me-input>
      </div>
    </section>

    <!-- 后置内容 -->
    <section class="play-section">
      <h2>后置内容</h2>
      <p class="play-desc">通过 #append 插槽设置后置内容</p>
      <div class="play-border">
        <me-input v-model="appendValue" placeholder="请输入邮箱">
          <template #append>@example.com</template>
        </me-input>
      </div>
    </section>

    <!-- 前置 + 后置 -->
    <section class="play-section">
      <h2>前置 + 后置内容</h2>
      <p class="play-desc">同时使用 #prepend 和 #append 插槽</p>
      <div class="play-border">
        <me-input v-model="bothValue" placeholder="请输入内容">
          <template #prepend>https://</template>
          <template #append>.com</template>
        </me-input>
      </div>
    </section>

    <!-- 前缀插槽 -->
    <section class="play-section">
      <h2>前缀插槽</h2>
      <p class="play-desc">通过 #prefix 插槽自定义前缀内容</p>
      <div class="play-border">
        <me-input v-model="prefixSlotValue" placeholder="请输入内容">
          <template #prefix>
            <Search />
          </template>
        </me-input>
      </div>
    </section>

    <!-- 后缀插槽 -->
    <section class="play-section">
      <h2>后缀插槽</h2>
      <p class="play-desc">通过 #suffix 插槽自定义后缀内容</p>
      <div class="play-border">
        <me-input v-model="suffixSlotValue" placeholder="请输入内容">
          <template #suffix>
            <Calendar />
          </template>
        </me-input>
      </div>
    </section>

    <!-- 最大输入长度 -->
    <section class="play-section">
      <h2>最大输入长度</h2>
      <p class="play-desc">设置 maxlength 属性限制输入字符数</p>
      <div class="play-border">
        <me-input v-model="maxlengthValue" :maxlength="10" placeholder="最多输入 10 个字符" />
        <p class="play-result">已输入：{{ maxlengthValue.length }} / 10</p>
      </div>
    </section>

    <!-- textarea 基础 -->
    <section class="play-section">
      <h2>textarea 基础用法</h2>
      <p class="play-desc">设置 type="textarea"，通过 rows 控制行数</p>
      <div class="play-border">
        <me-input v-model="textareaValue" type="textarea" :rows="4" placeholder="请输入多行内容" />
      </div>
    </section>

    <!-- textarea 自适应高度 -->
    <section class="play-section">
      <h2>textarea 自适应高度</h2>
      <p class="play-desc">设置 autosize 为 true，高度随内容自动调整</p>
      <div class="play-border">
        <me-input v-model="autosizeValue" type="textarea" autosize placeholder="输入内容会自动增高" />
      </div>
    </section>

    <!-- textarea 自适应高度（限定范围） -->
    <section class="play-section">
      <h2>textarea 自适应高度（限定范围）</h2>
      <p class="play-desc">设置 autosize 为 { minRows, maxRows }，限定最小和最大行数</p>
      <div class="play-border">
        <me-input
          v-model="autosizeRangeValue"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="最少 2 行，最多 5 行"
        />
      </div>
    </section>

    <!-- textarea 可清空 -->
    <section class="play-section">
      <h2>textarea 可清空</h2>
      <p class="play-desc">textarea 模式下同样支持 clearable</p>
      <div class="play-border">
        <me-input v-model="textareaClearableValue" type="textarea" clearable :rows="3" placeholder="请输入内容" />
      </div>
    </section>

    <!-- 自动获取焦点 -->
    <section class="play-section">
      <h2>自动获取焦点</h2>
      <p class="play-desc">设置 autofocus 属性，页面加载后自动聚焦</p>
      <div class="play-border">
        <me-input v-model="autofocusValue" autofocus placeholder="自动聚焦" />
      </div>
    </section>

    <!-- 方法调用 -->
    <section class="play-section">
      <h2>方法调用</h2>
      <p class="play-desc">通过 ref 调用 focus / blur / select 方法</p>
      <div class="play-border">
        <me-input ref="inputRef" v-model="methodValue" placeholder="通过按钮操作输入框" />
        <div class="play-buttons">
          <me-button size="small" @click="handleFocus">聚焦</me-button>
          <me-button size="small" @click="handleBlur">失焦</me-button>
          <me-button size="small" @click="handleSelect">选中文本</me-button>
        </div>
      </div>
    </section>

    <!-- 事件回调 -->
    <section class="play-section">
      <h2>事件回调</h2>
      <p class="play-desc">input / change / focus / blur / clear / keydown 事件</p>
      <div class="play-border">
        <me-input
          v-model="eventValue"
          clearable
          placeholder="输入并操作以触发事件"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          @clear="onClear"
          @keydown="onKeydown"
        />
        <p class="play-result">事件日志：{{ eventLog }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { Calendar, Search } from '@element-plus/icons-vue';

import type { MeInput } from '@me-ui/components/input';

/** 基础用法值 */
const basicValue = ref('');
/** text 类型值 */
const textValue = ref('');
/** number 类型值 */
const numberValue = ref('');
/** email 类型值 */
const emailValue = ref('');
/** tel 类型值 */
const telValue = ref('');
/** url 类型值 */
const urlValue = ref('');
/** 密码值 */
const passwordValue = ref('');
/** 可清空值 */
const clearableValue = ref('可清空的内容');
/** 禁用值 */
const disabledValue = ref('禁用内容');
/** 只读值 */
const readonlyValue = ref('只读内容');
/** 尺寸示例值 */
const sizeValue = ref('');
/** 前缀图标值 */
const prefixValue = ref('');
/** 后缀图标值 */
const suffixValue = ref('');
/** 前置内容值 */
const prependValue = ref('');
/** 后置内容值 */
const appendValue = ref('');
/** 前置+后置值 */
const bothValue = ref('');
/** 前缀插槽值 */
const prefixSlotValue = ref('');
/** 后缀插槽值 */
const suffixSlotValue = ref('');
/** 最大输入长度值 */
const maxlengthValue = ref('');
/** textarea 值 */
const textareaValue = ref('');
/** 自适应高度值 */
const autosizeValue = ref('');
/** 自适应高度（限定范围）值 */
const autosizeRangeValue = ref('');
/** textarea 可清空值 */
const textareaClearableValue = ref('可清空的文本');
/** 自动聚焦值 */
const autofocusValue = ref('');
/** 方法调用值 */
const methodValue = ref('选中文本');
/** 事件回调值 */
const eventValue = ref('');

/** 事件日志 */
const eventLog = ref('');

/** 输入框引用 */
const inputRef = ref<InstanceType<typeof MeInput>>();

function onInput(value: string) {
  eventLog.value = `input: ${value}`;
}

function onChange(value: string) {
  eventLog.value = `change: ${value}`;
}

function onFocus() {
  eventLog.value = 'focus: 聚焦';
}

function onBlur() {
  eventLog.value = 'blur: 失焦';
}

function onClear() {
  eventLog.value = 'clear: 已清空';
}

function onKeydown(evt: KeyboardEvent) {
  eventLog.value = `keydown: ${evt.key}`;
}

function handleFocus() {
  inputRef.value?.focus();
}

function handleBlur() {
  inputRef.value?.blur();
}

function handleSelect() {
  inputRef.value?.select();
}
</script>

<style lang="less" scoped>
.play-input {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.play-section {
  margin-bottom: 32px;

  h2 {
    font-size: 16px;
    margin-bottom: 8px;
  }
}

.play-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 12px;
}

.play-border {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.play-flex {
  display: flex;
  flex-direction: column;

  .me-input {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.play-result {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}

.play-buttons {
  display: flex;
  margin-top: 12px;

  button {
    margin-right: 8px;
  }
}
</style>
