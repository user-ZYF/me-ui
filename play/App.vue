<!-- ? Playground 调试页面 -->
<template>
  <div style="padding: 20px">
    <h1>Radio 组件测试</h1>

    <h2>基础用法</h2>
    <me-radio v-model="single" value="1" label="选项一"></me-radio>
    <me-radio v-model="single" value="2" label="选项二"></me-radio>
    <p>当前值: {{ single }}</p>

    <h2>RadioGroup 用法</h2>
    <me-radio-group v-model="group">
      <me-radio value="a" label="选项 A"></me-radio>
      <me-radio value="b" label="选项 B"></me-radio>
      <me-radio value="c" label="选项 C"></me-radio>
    </me-radio-group>
    <p>当前值: {{ group }}</p>

    <h2>禁用状态</h2>
    <me-radio-group v-model="disabledVal" disabled>
      <me-radio value="a" label="选项 A"></me-radio>
      <me-radio value="b" label="选项 B"></me-radio>
    </me-radio-group>

    <h2>尺寸</h2>
    <me-radio-group v-model="sizeVal" size="large">
      <me-radio value="a" label="大"></me-radio>
      <me-radio value="b" label="大"></me-radio>
    </me-radio-group>
    <br />
    <me-radio-group v-model="sizeVal" size="small">
      <me-radio value="a" label="小"></me-radio>
      <me-radio value="b" label="小"></me-radio>
    </me-radio-group>

    <h2>RadioButton 按钮样式</h2>
    <me-radio-group v-model="buttonVal">
      <me-radio-button value="a" label="选项 A"></me-radio-button>
      <me-radio-button value="b" label="选项 B"></me-radio-button>
      <me-radio-button value="c" label="选项 C"></me-radio-button>
    </me-radio-group>
    <p>当前值: {{ buttonVal }}</p>

    <h2>RadioButton 禁用</h2>
    <me-radio-group v-model="buttonDisabledVal" disabled>
      <me-radio-button value="a" label="选项 A"></me-radio-button>
      <me-radio-button value="b" label="选项 B"></me-radio-button>
    </me-radio-group>

    <h2>RadioButton 尺寸</h2>
    <me-radio-group v-model="buttonSizeVal" size="large">
      <me-radio-button value="a" label="大"></me-radio-button>
      <me-radio-button value="b" label="大"></me-radio-button>
    </me-radio-group>
    <br />
    <me-radio-group v-model="buttonSizeVal" size="small">
      <me-radio-button value="a" label="小"></me-radio-button>
      <me-radio-button value="b" label="小"></me-radio-button>
    </me-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineOptions({ name: 'PlaygroundApp' });

/** 单选值 */
const single = ref('1');
/** 分组单选值 */
const group = ref('a');
/** 禁用分组单选值 */
const disabledVal = ref('a');
/** 尺寸分组单选值 */
const sizeVal = ref('a');
/** 按钮样式单选值 */
const buttonVal = ref('a');
/** 按钮样式禁用单选值 */
const buttonDisabledVal = ref('a');
/** 按钮样式尺寸单选值 */
const buttonSizeVal = ref('a');
</script>
