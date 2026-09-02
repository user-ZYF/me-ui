<!-- ? Checkbox 多选框组件示例 -->
<template>
  <div class="play-checkbox">
    <h1>MeCheckbox 多选框</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">通过 v-model 双向绑定选中状态</p>
      <div class="play-border">
        <me-checkbox v-model="basicValue" label="同意协议" />
        <p class="play-result">当前值：{{ basicValue }}</p>
      </div>
    </section>

    <!-- 禁用状态 -->
    <section class="play-section">
      <h2>禁用状态</h2>
      <p class="play-desc">设置 disabled 属性禁用多选框</p>
      <div class="play-border">
        <me-checkbox v-model="disabledValue" label="选中且禁用" disabled />
        <me-checkbox v-model="disabledFalseValue" label="未选中且禁用" disabled />
      </div>
    </section>

    <!-- 半选状态 -->
    <section class="play-section">
      <h2>半选状态</h2>
      <p class="play-desc">设置 indeterminate 属性展示半选样式，常用于全选场景</p>
      <div class="play-border">
        <me-checkbox v-model="indeterminateValue" label="半选状态" indeterminate />
        <p class="play-result">当前值：{{ indeterminateValue }}</p>
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="play-section">
      <h2>不同尺寸</h2>
      <p class="play-desc">large / default / small</p>
      <div class="play-border play-flex">
        <me-checkbox v-model="sizeValue" label="large 尺寸" size="large" />
        <me-checkbox v-model="sizeValue" label="default 尺寸" size="default" />
        <me-checkbox v-model="sizeValue" label="small 尺寸" size="small" />
      </div>
    </section>

    <!-- 自定义内容 -->
    <section class="play-section">
      <h2>自定义内容</h2>
      <p class="play-desc">通过默认插槽自定义标签内容</p>
      <div class="play-border">
        <me-checkbox v-model="slotValue">
          <span style="color: #409eff;">自定义内容</span>
        </me-checkbox>
      </div>
    </section>

    <!-- 事件回调 -->
    <section class="play-section">
      <h2>事件回调</h2>
      <p class="play-desc">change 事件在选中状态变化时触发</p>
      <div class="play-border">
        <me-checkbox v-model="eventValue" label="触发事件" @change="onChange" />
        <p class="play-result">事件日志：{{ eventLog }}</p>
      </div>
    </section>

    <!-- CheckboxGroup 基础用法 -->
    <section class="play-section">
      <h2>CheckboxGroup 基础用法</h2>
      <p class="play-desc">通过 me-checkbox-group 管理一组多选框，v-model 绑定选中值数组</p>
      <div class="play-border">
        <me-checkbox-group v-model="groupValue">
          <me-checkbox value="apple" label="苹果" />
          <me-checkbox value="banana" label="香蕉" />
          <me-checkbox value="orange" label="橙子" />
          <me-checkbox value="grape" label="葡萄" />
        </me-checkbox-group>
        <p class="play-result">当前选中：{{ groupValue }}</p>
      </div>
    </section>

    <!-- CheckboxGroup 禁用 -->
    <section class="play-section">
      <h2>CheckboxGroup 禁用</h2>
      <p class="play-desc">在 me-checkbox-group 上设置 disabled 禁用全部子多选框</p>
      <div class="play-border">
        <me-checkbox-group v-model="groupDisabledValue" disabled>
          <me-checkbox value="a" label="选项 A" />
          <me-checkbox value="b" label="选项 B" />
          <me-checkbox value="c" label="选项 C" />
        </me-checkbox-group>
        <p class="play-result">当前选中：{{ groupDisabledValue }}</p>
      </div>
    </section>

    <!-- CheckboxGroup 尺寸 -->
    <section class="play-section">
      <h2>CheckboxGroup 尺寸</h2>
      <p class="play-desc">在 me-checkbox-group 上设置 size 控制全部子多选框尺寸</p>
      <div class="play-border play-flex">
        <me-checkbox-group v-model="groupSizeValue" size="large">
          <me-checkbox value="a" label="large A" />
          <me-checkbox value="b" label="large B" />
        </me-checkbox-group>
        <me-checkbox-group v-model="groupSizeValue" size="default">
          <me-checkbox value="a" label="default A" />
          <me-checkbox value="b" label="default B" />
        </me-checkbox-group>
        <me-checkbox-group v-model="groupSizeValue" size="small">
          <me-checkbox value="a" label="small A" />
          <me-checkbox value="b" label="small B" />
        </me-checkbox-group>
      </div>
    </section>

    <!-- CheckboxGroup 事件回调 -->
    <section class="play-section">
      <h2>CheckboxGroup 事件回调</h2>
      <p class="play-desc">change 事件在选中值变化时触发，返回当前选中值数组</p>
      <div class="play-border">
        <me-checkbox-group v-model="groupEventValue" @change="onGroupChange">
          <me-checkbox value="read" label="阅读" />
          <me-checkbox value="write" label="写作" />
          <me-checkbox value="code" label="编程" />
        </me-checkbox-group>
        <p class="play-result">事件日志：{{ groupEventLog }}</p>
      </div>
    </section>

    <!-- 全选与半选联动 -->
    <section class="play-section">
      <h2>全选与半选联动</h2>
      <p class="play-desc">通过 indeterminate 和全选多选框实现全选/反选/半选联动</p>
      <div class="play-border">
        <me-checkbox
          v-model="isAllChecked"
          :indeterminate="isIndeterminate"
          label="全选"
          @change="handleCheckAll"
        />
        <div style="margin-top: 12px;">
          <me-checkbox-group v-model="checkAllValue" @change="handleCheckedChange">
            <me-checkbox v-for="item in cityOptions" :key="item" :value="item" :label="item" />
          </me-checkbox-group>
        </div>
        <p class="play-result">当前选中：{{ checkAllValue }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** 基础用法值 */
const basicValue = ref(false);
/** 禁用且选中值 */
const disabledValue = ref(true);
/** 禁用且未选中值 */
const disabledFalseValue = ref(false);
/** 半选状态值 */
const indeterminateValue = ref(false);
/** 尺寸示例值 */
const sizeValue = ref(true);
/** 自定义内容值 */
const slotValue = ref(true);
/** 事件回调值 */
const eventValue = ref(false);

/** 事件日志 */
const eventLog = ref('');

/** CheckboxGroup 基础值 */
const groupValue = ref<Array<string | number | boolean>>(['apple', 'orange']);
/** CheckboxGroup 禁用值 */
const groupDisabledValue = ref<Array<string | number | boolean>>(['a']);
/** CheckboxGroup 尺寸值 */
const groupSizeValue = ref<Array<string | number | boolean>>([]);
/** CheckboxGroup 事件值 */
const groupEventValue = ref<Array<string | number | boolean>>([]);

/** CheckboxGroup 事件日志 */
const groupEventLog = ref('');

/** 全选选项 */
const cityOptions = ['北京', '上海', '广州', '深圳'];
/** 全选值 */
const checkAllValue = ref<Array<string | number | boolean>>([]);
/** 是否全选 */
const isAllChecked = ref(false);
/** 是否半选 */
const isIndeterminate = ref(false);

/** change 事件 */
function onChange(value: boolean) {
  eventLog.value = `change: ${value}`;
}

/** CheckboxGroup change 事件 */
function onGroupChange(value: Array<string | number | boolean>) {
  groupEventLog.value = `change: ${JSON.stringify(value)}`;
}

/** 全选切换 */
function handleCheckAll() {
  checkAllValue.value = isAllChecked.value ? [...cityOptions] : [];
  isIndeterminate.value = false;
}

/** 选中值变化 */
function handleCheckedChange(value: Array<string | number | boolean>) {
  const checkedCount = value.length;
  isAllChecked.value = checkedCount === cityOptions.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cityOptions.length;
}
</script>

<style lang="less" scoped>
.play-checkbox {
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
}

.play-result {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}
</style>
