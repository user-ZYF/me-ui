<!-- ? Ant Design Vue 虚拟滚动 + 自定义选项示例 -->
<template>
  <div class="antd-virtual-root">
    <h1>Ant Design Vue - 虚拟滚动 + 自定义选项</h1>

    <!-- 方式一：options 数据 + option 自定义插槽 -->
    <section class="antd-virtual-section">
      <h2>方式一：options 数据 + option 插槽自定义</h2>
      <p class="antd-virtual-desc">
        通过 options 传入数据数组，启用 virtual 虚拟滚动，同时使用 #option 插槽自定义每项渲染
      </p>
      <a-select
        v-model:value="dataModeValue"
        :options="largeOptions"
        :virtual="true"
        :list-height="200"
        :field-names="fieldNames"
        style="width: 400px"
        placeholder="请选择（虚拟滚动 + 自定义渲染）"
      >
        <template #option="{ value, label, disabled }">
          <div class="antd-virtual-custom-option" :class="{ 'is-disabled': disabled }">
            <span class="antd-virtual-custom-option-icon">{{ label.charAt(0) }}</span>
            <span class="antd-virtual-custom-option-text">{{ label }}</span>
            <span class="antd-virtual-custom-option-id">#{{ value }}</span>
          </div>
        </template>
      </a-select>
      <span class="antd-virtual-label">当前值：{{ dataModeValue ?? '--' }}</span>
    </section>

    <!-- 方式二：a-select-option 子组件 + virtual -->
    <section class="antd-virtual-section">
      <h2>方式二：a-select-option 子组件 + virtual</h2>
      <p class="antd-virtual-desc">
        通过 a-select-option 子组件传入选项，同样启用 virtual 虚拟滚动，子组件内可自定义内容
      </p>
      <a-select
        v-model:value="slotModeValue"
        :virtual="true"
        :list-height="200"
        style="width: 400px"
        placeholder="请选择（虚拟滚动 + slot 自定义）"
      >
        <a-select-option
          v-for="item in largeSlotOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
          :disabled="item.disabled"
        >
          <div class="antd-virtual-custom-option">
            <span class="antd-virtual-custom-option-icon">{{ item.label.charAt(0) }}</span>
            <span class="antd-virtual-custom-option-text">{{ item.label }}</span>
            <span class="antd-virtual-custom-option-id">#{{ item.value }}</span>
          </div>
        </a-select-option>
      </a-select>
      <span class="antd-virtual-label">当前值：{{ slotModeValue ?? '--' }}</span>
    </section>

    <!-- 方式三：多选 + 虚拟滚动 + 自定义选项 -->
    <section class="antd-virtual-section">
      <h2>方式三：多选 + 虚拟滚动 + 自定义选项</h2>
      <p class="antd-virtual-desc">
        多选模式下同样支持虚拟滚动和 option 插槽自定义渲染
      </p>
      <a-select
        v-model:value="multiModeValue"
        mode="multiple"
        :options="largeOptions"
        :virtual="true"
        :list-height="200"
        :field-names="fieldNames"
        style="width: 500px"
        placeholder="请选择（多选 + 虚拟滚动 + 自定义）"
        :max-tag-count="3"
      >
        <template #option="{ value, label }">
          <div class="antd-virtual-custom-option">
            <span class="antd-virtual-custom-option-icon">{{ label.charAt(0) }}</span>
            <span class="antd-virtual-custom-option-text">{{ label }}</span>
            <span class="antd-virtual-custom-option-id">#{{ value }}</span>
          </div>
        </template>
      </a-select>
      <span class="antd-virtual-label">当前值：{{ multiModeValue?.length ? multiModeValue.join(', ') : '--' }}</span>
    </section>

    <!-- 方式四：可搜索 + 虚拟滚动 + 自定义选项 -->
    <section class="antd-virtual-section">
      <h2>方式四：可搜索 + 虚拟滚动 + 自定义选项</h2>
      <p class="antd-virtual-desc">
        开启 showSearch 搜索过滤，配合虚拟滚动和自定义渲染
      </p>
      <a-select
        v-model:value="searchModeValue"
        show-search
        :options="largeOptions"
        :virtual="true"
        :list-height="200"
        :field-names="fieldNames"
        style="width: 400px"
        placeholder="输入关键词搜索（虚拟滚动）"
        :filter-option="filterOption"
      >
        <template #option="{ value, label }">
          <div class="antd-virtual-custom-option">
            <span class="antd-virtual-custom-option-icon">{{ label.charAt(0) }}</span>
            <span class="antd-virtual-custom-option-text">{{ label }}</span>
            <span class="antd-virtual-custom-option-id">#{{ value }}</span>
          </div>
        </template>
      </a-select>
      <span class="antd-virtual-label">当前值：{{ searchModeValue ?? '--' }}</span>
    </section>

    <!-- 对比：关闭虚拟滚动 -->
    <section class="antd-virtual-section">
      <h2>对比：关闭虚拟滚动（virtual=false）</h2>
      <p class="antd-virtual-desc">
        同样 10000 条数据，关闭虚拟滚动后全部渲染 DOM，可感受性能差异
      </p>
      <a-select
        v-model:value="noVirtualValue"
        :options="largeOptions"
        :virtual="false"
        :list-height="200"
        :field-names="fieldNames"
        style="width: 400px"
        placeholder="请选择（无虚拟滚动）"
      >
        <template #option="{ value, label }">
          <div class="antd-virtual-custom-option">
            <span class="antd-virtual-custom-option-icon">{{ label.charAt(0) }}</span>
            <span class="antd-virtual-custom-option-text">{{ label }}</span>
            <span class="antd-virtual-custom-option-id">#{{ value }}</span>
          </div>
        </template>
      </a-select>
      <span class="antd-virtual-label">当前值：{{ noVirtualValue ?? '--' }}</span>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/** 选项数据类型 */
interface SelectOption {
  /** 选项值 */
  value: number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/** fieldNames 映射 */
const fieldNames = {
  label: 'label',
  value: 'value',
};

/** 生成大量测试数据 */
function generateOptions(count: number): SelectOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: i + 1,
    label: `选项 ${String(i + 1).padStart(5, '0')}`,
    disabled: (i + 1) % 100 === 0,
  }));
}

/** 10000 条选项数据 */
const largeOptions = ref<SelectOption[]>(generateOptions(10000));

/** slot 模式选项数据（前 5000 条） */
const largeSlotOptions = ref<SelectOption[]>(generateOptions(5000));

/** 方式一：data 模式选中值 */
const dataModeValue = ref<number>();
/** 方式二：slot 模式选中值 */
const slotModeValue = ref<number>();
/** 方式三：多选模式选中值 */
const multiModeValue = ref<number[]>([]);
/** 方式四：搜索模式选中值 */
const searchModeValue = ref<number>();
/** 对比：无虚拟滚动选中值 */
const noVirtualValue = ref<number>();

/** 自定义过滤函数 */
function filterOption(input: string, option: SelectOption) {
  return option.label.toLowerCase().includes(input.toLowerCase());
}
</script>

<style lang="less">
.antd-virtual-root {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.antd-virtual-section {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;

  h2 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
  }
}

.antd-virtual-desc {
  margin: 0 0 12px;
  color: #999;
  font-size: 13px;
  line-height: 1.6;
}

.antd-virtual-label {
  margin-left: 12px;
  color: #666;
  font-size: 13px;
}

.antd-virtual-custom-option {
  display: flex;
  align-items: center;
  padding: 4px 0;

  &.is-disabled {
    opacity: 0.4;
  }
}

.antd-virtual-custom-option-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 4px;
  background: #e6f4ff;
  color: #1677ff;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.antd-virtual-custom-option-text {
  flex: 1;
  font-size: 14px;
}

.antd-virtual-custom-option-id {
  color: #bbb;
  font-size: 12px;
  font-family: monospace;
}
</style>
