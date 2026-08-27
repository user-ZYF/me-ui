<!-- ? MeSelect 选择器组件使用示例 -->
<template>
  <div class="play-root">
    <h1>MeSelect 选择器组件示例</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">单选下拉选择器，适用各种文本选项场景</p>
      <div class="play-select-row">
        <me-select v-model="singleValue" placeholder="请选择水果">
          <me-option value="apple" label="苹果" />
          <me-option value="banana" label="香蕉" />
          <me-option value="orange" label="橙子" />
          <me-option value="grape" label="葡萄" />
          <me-option value="pear" label="梨" />
        </me-select>
        <span class="play-label">当前值：{{ singleValue || '--' }}</span>
      </div>
    </section>

    <!-- 默认选中 -->
    <section class="play-section">
      <h2>默认选中</h2>
      <p class="play-desc">通过 v-model 设置初始值，组件挂载即显示选中项</p>
      <div class="play-select-row">
        <me-select v-model="defaultValue" placeholder="请选择">
          <me-option value="a" label="选项 A" />
          <me-option value="b" label="选项 B" />
          <me-option value="c" label="选项 C" />
        </me-select>
        <span class="play-label">当前值：{{ defaultValue }}</span>
      </div>
    </section>

    <!-- 可搜索 -->
    <section class="play-section">
      <h2>可搜索</h2>
      <p class="play-desc">设置 filterable 开启搜索功能，输入时实时过滤选项</p>
      <div class="play-select-row">
        <me-select v-model="filterValue" filterable placeholder="输入城市名搜索">
          <me-option value="beijing" label="北京" />
          <me-option value="shanghai" label="上海" />
          <me-option value="guangzhou" label="广州" />
          <me-option value="shenzhen" label="深圳" />
          <me-option value="hangzhou" label="杭州" />
          <me-option value="nanjing" label="南京" />
          <me-option value="chengdu" label="成都" />
          <me-option value="wuhan" label="武汉" />
          <me-option value="xian" label="西安" />
          <me-option value="chongqing" label="重庆" />
        </me-select>
        <span class="play-label">当前值：{{ filterValue || '--' }}</span>
      </div>
    </section>

    <!-- 自定义筛选 -->
    <section class="play-section">
      <h2>自定义筛选</h2>
      <p class="play-desc">通过 filterMethod 自定义筛选逻辑，支持按城市名或拼音首字母搜索（如输入 "bj" 匹配北京）</p>
      <div class="play-select-row">
        <me-select
          v-model="customFilterValue"
          filterable
          :filter-method="customFilterMethod"
          placeholder="输入城市名或拼音首字母"
        >
          <me-option value="beijing" label="北京" />
          <me-option value="shanghai" label="上海" />
          <me-option value="guangzhou" label="广州" />
          <me-option value="shenzhen" label="深圳" />
          <me-option value="hangzhou" label="杭州" />
          <me-option value="nanjing" label="南京" />
          <me-option value="chengdu" label="成都" />
          <me-option value="wuhan" label="武汉" />
          <me-option value="xian" label="西安" />
          <me-option value="chongqing" label="重庆" />
        </me-select>
        <span class="play-label">当前值：{{ customFilterValue || '--' }}</span>
      </div>
    </section>

    <!-- 多选 -->
    <section class="play-section">
      <h2>多选</h2>
      <p class="play-desc">设置 multiple 开启多选模式，选中项以标签形式展示，点击标签可取消选中</p>
      <div class="play-select-row">
        <me-select v-model="multiValue" multiple placeholder="请选择编程语言">
          <me-option value="js" label="JavaScript" />
          <me-option value="ts" label="TypeScript" />
          <me-option value="py" label="Python" />
          <me-option value="go" label="Go" />
          <me-option value="rust" label="Rust" />
          <me-option value="java" label="Java" />
          <me-option value="cpp" label="C++" />
        </me-select>
        <span class="play-label">当前值：{{ multiValue.length ? multiValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 多选 + 可搜索 -->
    <section class="play-section">
      <h2>多选 + 可搜索</h2>
      <p class="play-desc">同时开启 multiple 和 filterable，输入关键词过滤后多选</p>
      <div class="play-select-row">
        <me-select v-model="multiFilterValue" multiple filterable placeholder="搜索并多选">
          <me-option value="react" label="React" />
          <me-option value="vue" label="Vue" />
          <me-option value="angular" label="Angular" />
          <me-option value="svelte" label="Svelte" />
          <me-option value="solid" label="SolidJS" />
          <me-option value="qwik" label="Qwik" />
        </me-select>
        <span class="play-label">当前值：{{ multiFilterValue.length ? multiFilterValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 最大标签数 -->
    <section class="play-section">
      <h2>最大标签数</h2>
      <p class="play-desc">设置 max-tag-count 限制多选模式下显示的标签数量，超出部分折叠为 +N</p>
      <div class="play-select-row">
        <me-select v-model="maxTagValue" multiple :max-tag-count="3" placeholder="最多显示 3 个标签">
          <me-option value="js" label="JavaScript" />
          <me-option value="ts" label="TypeScript" />
          <me-option value="py" label="Python" />
          <me-option value="go" label="Go" />
          <me-option value="rust" label="Rust" />
          <me-option value="java" label="Java" />
          <me-option value="cpp" label="C++" />
        </me-select>
        <span class="play-label">当前值：{{ maxTagValue.length ? maxTagValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 最大标签数为 0 -->
    <section class="play-section">
      <h2>最大标签数为 0</h2>
      <p class="play-desc">设置 max-tag-count 为 0 时，所有选中项都折叠为 +N 标签</p>
      <div class="play-select-row">
        <me-select v-model="maxTagZeroValue" multiple :max-tag-count="0" placeholder="全部折叠">
          <me-option value="js" label="JavaScript" />
          <me-option value="ts" label="TypeScript" />
          <me-option value="py" label="Python" />
          <me-option value="go" label="Go" />
          <me-option value="rust" label="Rust" />
        </me-select>
        <span class="play-label">当前值：{{ maxTagZeroValue.length ? maxTagZeroValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 最大标签数 + 可搜索 -->
    <section class="play-section">
      <h2>最大标签数 + 可搜索</h2>
      <p class="play-desc">同时开启 max-tag-count 和 filterable，搜索过滤后多选，标签数量超出时自动折叠</p>
      <div class="play-select-row">
        <me-select
          v-model="maxTagFilterValue"
          multiple
          filterable
          :max-tag-count="2"
          placeholder="搜索并多选（最多显示 2 个标签）"
        >
          <me-option value="react" label="React" />
          <me-option value="vue" label="Vue" />
          <me-option value="angular" label="Angular" />
          <me-option value="svelte" label="Svelte" />
          <me-option value="solid" label="SolidJS" />
          <me-option value="qwik" label="Qwik" />
        </me-select>
        <span class="play-label">当前值：{{ maxTagFilterValue.length ? maxTagFilterValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 最大标签数 + 可清空 -->
    <section class="play-section">
      <h2>最大标签数 + 可清空</h2>
      <p class="play-desc">同时开启 max-tag-count 和 clearable，悬停时显示清除按钮可一键清空所有选中项</p>
      <div class="play-select-row">
        <me-select
          v-model="maxTagClearValue"
          multiple
          clearable
          :max-tag-count="2"
          placeholder="可清空（最多显示 2 个标签）"
        >
          <me-option value="apple" label="苹果" />
          <me-option value="banana" label="香蕉" />
          <me-option value="orange" label="橙子" />
          <me-option value="grape" label="葡萄" />
          <me-option value="pear" label="梨" />
          <me-option value="cherry" label="樱桃" />
        </me-select>
        <span class="play-label">当前值：{{ maxTagClearValue.length ? maxTagClearValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 响应式最大标签数 -->
    <section class="play-section">
      <h2>响应式最大标签数</h2>
      <p class="play-desc">设置 max-tag-count 为 responsive，根据容器宽度自动计算可显示的标签数量，超出部分折叠为 +N</p>
      <div class="play-responsive-area">
        <div class="play-responsive-controls">
          <me-button size="small" @click="responsiveWidth = 200">200px</me-button>
          <me-button size="small" @click="responsiveWidth = 300">300px</me-button>
          <me-button size="small" @click="responsiveWidth = 400">400px</me-button>
          <me-button size="small" @click="responsiveWidth = 600">600px</me-button>
          <span class="play-label">当前宽度：{{ responsiveWidth }}px</span>
        </div>
        <div class="play-responsive-wrapper" :style="{ width: `${responsiveWidth}px` }">
          <me-select
            v-model="responsiveValue"
            multiple
            max-tag-count="responsive"
            placeholder="响应式标签数"
          >
            <me-option value="js" label="JavaScript" />
            <me-option value="ts" label="TypeScript" />
            <me-option value="py" label="Python" />
            <me-option value="go" label="Go" />
            <me-option value="rust" label="Rust" />
            <me-option value="java" label="Java" />
            <me-option value="cpp" label="C++" />
            <me-option value="csharp" label="C#" />
          </me-select>
        </div>
        <span class="play-label">当前值：{{ responsiveValue.length ? responsiveValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 响应式 + 可搜索 -->
    <section class="play-section">
      <h2>响应式 + 可搜索</h2>
      <p class="play-desc">同时开启 responsive 和 filterable，搜索过滤后多选，标签数量根据容器宽度自动折叠</p>
      <div class="play-responsive-area">
        <div class="play-responsive-controls">
          <me-button size="small" @click="responsiveFilterWidth = 200">200px</me-button>
          <me-button size="small" @click="responsiveFilterWidth = 350">350px</me-button>
          <me-button size="small" @click="responsiveFilterWidth = 500">500px</me-button>
          <span class="play-label">当前宽度：{{ responsiveFilterWidth }}px</span>
        </div>
        <div class="play-responsive-wrapper" :style="{ width: `${responsiveFilterWidth}px` }">
          <me-select
            v-model="responsiveFilterValue"
            multiple
            filterable
            max-tag-count="responsive"
            placeholder="搜索并多选（响应式）"
          >
            <me-option value="react" label="React" />
            <me-option value="vue" label="Vue" />
            <me-option value="angular" label="Angular" />
            <me-option value="svelte" label="Svelte" />
            <me-option value="solid" label="SolidJS" />
            <me-option value="qwik" label="Qwik" />
            <me-option value="lit" label="Lit" />
            <me-option value="astro" label="Astro" />
          </me-select>
        </div>
        <span class="play-label">当前值：{{ responsiveFilterValue.length ? responsiveFilterValue.join(', ') : '--' }}</span>
      </div>
    </section>

    <!-- 可清空 -->
    <section class="play-section">
      <h2>可清空</h2>
      <p class="play-desc">设置 clearable，选中后悬停组件显示清除按钮，点击可清空选中值</p>
      <div class="play-select-row">
        <me-select v-model="clearValue" clearable placeholder="请选择">
          <me-option value="1" label="选项一" />
          <me-option value="2" label="选项二" />
          <me-option value="3" label="选项三" />
        </me-select>
        <span class="play-label">当前值：{{ clearValue || '--' }}</span>
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用</h2>
      <p class="play-desc">设置 disabled 禁用整个选择器，无法展开和操作</p>
      <div class="play-select-row">
        <me-select v-model="disabledValue" disabled placeholder="禁用状态">
          <me-option value="1" label="选项一" />
          <me-option value="2" label="选项二" />
        </me-select>
        <span class="play-label">当前值：{{ disabledValue || '--' }}</span>
      </div>
    </section>

    <!-- 禁用选项 -->
    <section class="play-section">
      <h2>禁用选项</h2>
      <p class="play-desc">单个 Option 设置 disabled，该选项可见但不可选</p>
      <div class="play-select-row">
        <me-select v-model="disabledOptValue" placeholder="请选择">
          <me-option value="1" label="选项一" />
          <me-option value="2" label="选项二（禁用）" disabled />
          <me-option value="3" label="选项三" />
          <me-option value="4" label="选项四（禁用）" disabled />
          <me-option value="5" label="选项五" />
        </me-select>
        <span class="play-label">当前值：{{ disabledOptValue || '--' }}</span>
      </div>
    </section>

    <!-- 尺寸 -->
    <section class="play-section">
      <h2>尺寸</h2>
      <p class="play-desc">large / default / small 三种尺寸，适配不同布局密度</p>
      <div class="play-select-sizes">
        <div class="play-select-sizes-item">
          <span class="play-label">large</span>
          <me-select v-model="sizeLarge" size="large" placeholder="large">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
          </me-select>
        </div>
        <div class="play-select-sizes-item">
          <span class="play-label">default</span>
          <me-select v-model="sizeDefault" size="default" placeholder="default">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
          </me-select>
        </div>
        <div class="play-select-sizes-item">
          <span class="play-label">small</span>
          <me-select v-model="sizeSmall" size="small" placeholder="small">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
          </me-select>
        </div>
      </div>
    </section>

    <!-- 数字值 -->
    <section class="play-section">
      <h2>数字值</h2>
      <p class="play-desc">Option 的 value 支持数字类型，适用于 ID 选择等场景</p>
      <div class="play-select-row">
        <me-select v-model="numberValue" placeholder="请选择用户">
          <me-option :value="1" label="张三" />
          <me-option :value="2" label="李四" />
          <me-option :value="3" label="王五" />
          <me-option :value="4" label="赵六" />
        </me-select>
        <span class="play-label">当前值：{{ numberValue ?? '--' }}（类型：{{ typeof numberValue }}）</span>
      </div>
    </section>

    <!-- 自定义选项内容 -->
    <section class="play-section">
      <h2>自定义选项内容</h2>
      <p class="play-desc">通过 Option 的默认插槽自定义下拉项内容</p>
      <div class="play-select-row">
        <me-select v-model="customValue" placeholder="请选择">
          <me-option value="vip1" label="VIP 1">
            <span class="play-option-custom">
              <span class="play-option-custom-label">VIP 1</span>
              <span class="play-option-custom-tag">月费 ¥30</span>
            </span>
          </me-option>
          <me-option value="vip2" label="VIP 2">
            <span class="play-option-custom">
              <span class="play-option-custom-label">VIP 2</span>
              <span class="play-option-custom-tag">月费 ¥68</span>
            </span>
          </me-option>
          <me-option value="vip3" label="VIP 3">
            <span class="play-option-custom">
              <span class="play-option-custom-label">VIP 3</span>
              <span class="play-option-custom-tag">月费 ¥128</span>
            </span>
          </me-option>
        </me-select>
        <span class="play-label">当前值：{{ customValue || '--' }}</span>
      </div>
    </section>

    <!-- 前缀插槽 -->
    <section class="play-section">
      <h2>前缀插槽</h2>
      <p class="play-desc">通过 prefix 插槽在触发器左侧添加自定义内容</p>
      <div class="play-select-row">
        <me-select v-model="prefixValue" placeholder="请选择">
          <template #prefix>
            <span class="play-prefix-text">部门</span>
          </template>
          <me-option value="tech" label="技术部" />
          <me-option value="product" label="产品部" />
          <me-option value="design" label="设计部" />
          <me-option value="market" label="市场部" />
        </me-select>
        <span class="play-label">当前值：{{ prefixValue || '--' }}</span>
      </div>
    </section>

    <!-- 下拉框自定义类名 -->
    <section class="play-section">
      <h2>下拉框自定义类名</h2>
      <p class="play-desc">通过 popper-class 为下拉框添加自定义类名，实现样式定制</p>
      <div class="play-select-row">
        <me-select v-model="popperValue" popper-class="play-custom-popper" placeholder="请选择">
          <me-option value="1" label="选项一" />
          <me-option value="2" label="选项二" />
          <me-option value="3" label="选项三" />
        </me-select>
        <span class="play-label">当前值：{{ popperValue || '--' }}</span>
      </div>
    </section>

    <!-- 事件演示 -->
    <section class="play-section">
      <h2>事件演示</h2>
      <p class="play-desc">监听 change / clear / visible-change / focus / blur / remove-tag 事件</p>
      <div class="play-select-row">
        <me-select
          v-model="eventValue"
          multiple
          clearable
          filterable
          placeholder="请选择"
          @change="onChangeEvent"
          @clear="onClearEvent"
          @visible-change="onVisibleChangeEvent"
          @focus="onFocusEvent"
          @blur="onBlurEvent"
          @remove-tag="onRemoveTagEvent"
        >
          <me-option value="a" label="选项 A" />
          <me-option value="b" label="选项 B" />
          <me-option value="c" label="选项 C" />
          <me-option value="d" label="选项 D" />
        </me-select>
      </div>
      <div class="play-event-log">
        <span class="play-label">事件日志：</span>
        <div class="play-event-log-list">
          <p v-for="(log, index) in eventLogs" :key="index">{{ log }}</p>
          <p v-if="eventLogs.length === 0" class="play-event-log-empty">暂无事件，请操作上方选择器</p>
        </div>
        <me-button size="small" @click="eventLogs = []">清空日志</me-button>
      </div>
    </section>

    <!-- 下拉框出现位置 -->
    <section class="play-section">
      <h2>下拉框出现位置</h2>
      <p class="play-desc">通过 placement 控制下拉框相对于触发器的弹出位置，支持 top / bottom / left / right 及其变体</p>
      <div class="play-placement-grid">
        <div class="play-placement-item">
          <span class="play-label">top</span>
          <me-select v-model="placementTopValue" placement="top" placeholder="top">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">top-start</span>
          <me-select v-model="placementTopStartValue" placement="top-start" placeholder="top-start">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">top-end</span>
          <me-select v-model="placementTopEndValue" placement="top-end" placeholder="top-end">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">bottom（默认）</span>
          <me-select v-model="placementBottomValue" placement="bottom" placeholder="bottom">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">bottom-start</span>
          <me-select v-model="placementBottomStartValue" placement="bottom-start" placeholder="bottom-start">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">bottom-end</span>
          <me-select v-model="placementBottomEndValue" placement="bottom-end" placeholder="bottom-end">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">left</span>
          <me-select v-model="placementLeftValue" placement="left" placeholder="left">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
        <div class="play-placement-item">
          <span class="play-label">right</span>
          <me-select v-model="placementRightValue" placement="right" placeholder="right">
            <me-option value="1" label="选项一" />
            <me-option value="2" label="选项二" />
            <me-option value="3" label="选项三" />
          </me-select>
        </div>
      </div>
    </section>

    <!-- 大数据量 -->
    <section class="play-section">
      <h2>大数据量</h2>
      <p class="play-desc">100 条选项的性能与滚动测试，可配合 filterable 搜索</p>
      <div class="play-select-row">
        <me-select v-model="largeValue" filterable placeholder="请选择（共 100 项）">
          <me-option
            v-for="i in 100"
            :key="i"
            :value="i"
            :label="`选项 ${i}`"
          />
        </me-select>
        <span class="play-label">当前值：{{ largeValue ?? '--' }}</span>
      </div>
    </section>

    <!-- 虚拟滚动：options prop + option 插槽 -->
    <section class="play-section">
      <h2>虚拟滚动 - options + option 插槽</h2>
      <p class="play-desc">通过 options 传入 10000 条数据，启用 virtual 虚拟滚动，使用 #option 插槽自定义渲染</p>
      <div class="play-select-row">
        <me-select
          v-model="virtualDataValue"
          :options="virtualOptions"
          virtual
          filterable
          :list-height="274"
          :list-item-height="34"
          style="width: 400px"
          placeholder="请选择（10000 项虚拟滚动）"
        >
          <template #option="{ item }">
            <div class="play-virtual-option">
              <span class="play-virtual-option-icon">{{ String(item.label).charAt(0) }}</span>
              <span class="play-virtual-option-text">{{ item.label }}</span>
              <span class="play-virtual-option-id">#{{ item.value }}</span>
            </div>
          </template>
        </me-select>
        <span class="play-label">当前值：{{ virtualDataValue ?? '--' }}</span>
      </div>
    </section>

    <!-- 虚拟滚动：me-option 子组件 + 自定义内容 -->
    <section class="play-section">
      <h2>虚拟滚动 - me-option 子组件</h2>
      <p class="play-desc">使用 me-option 子组件传入选项，自定义内容渲染（普通滚动模式）</p>
      <div class="play-select-row">
        <me-select
          v-model="virtualSlotValue"
          filterable
          style="width: 400px"
          placeholder="请选择（me-option 自定义内容）"
        >
          <me-option
            v-for="item in virtualSlotOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
            <div class="play-virtual-option">
              <span class="play-virtual-option-icon">{{ String(item.label).charAt(0) }}</span>
              <span class="play-virtual-option-text">{{ item.label }}</span>
              <span class="play-virtual-option-id">#{{ item.value }}</span>
            </div>
          </me-option>
        </me-select>
        <span class="play-label">当前值：{{ virtualSlotValue ?? '--' }}</span>
      </div>
    </section>

    <!-- 虚拟滚动：多选 -->
    <section class="play-section">
      <h2>虚拟滚动 - 多选</h2>
      <p class="play-desc">多选模式 + 虚拟滚动 + option 插槽自定义渲染</p>
      <div class="play-select-row">
        <me-select
          v-model="virtualMultiValue"
          :options="virtualOptions"
          virtual
          multiple
          filterable
          :list-height="274"
          :list-item-height="34"
          style="width: 500px"
          placeholder="请选择（多选 + 虚拟滚动）"
        >
          <template #option="{ item }">
            <div class="play-virtual-option">
              <span class="play-virtual-option-icon">{{ String(item.label).charAt(0) }}</span>
              <span class="play-virtual-option-text">{{ item.label }}</span>
              <span class="play-virtual-option-id">#{{ item.value }}</span>
            </div>
          </template>
        </me-select>
        <span class="play-label">当前值：{{ virtualMultiValue.length ? virtualMultiValue.join(', ') : '--' }}</span>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { OptionValue } from '../src/components/select/select';

/** 基础用法 */
const singleValue = ref('');
/** 默认选中 */
const defaultValue = ref('b');
/** 可搜索 */
const filterValue = ref('');
/** 自定义筛选 */
const customFilterValue = ref('');
/** 城市拼音首字母映射 */
const pinyinMap: Record<string, string> = {
  beijing: 'bj',
  shanghai: 'sh',
  guangzhou: 'gz',
  shenzhen: 'sz',
  hangzhou: 'hz',
  nanjing: 'nj',
  chengdu: 'cd',
  wuhan: 'wh',
  xian: 'xa',
  chongqing: 'cq',
};

/** 自定义筛选函数：按城市名或拼音首字母匹配 */
function customFilterMethod(query: string, option: { value: OptionValue; label: string | number }): boolean {
  const q = query.toLowerCase();
  const labelStr = String(option.label).toLowerCase();
  const valueStr = String(option.value).toLowerCase();
  const pinyin = pinyinMap[String(option.value)] ?? '';
  return labelStr.includes(q) || valueStr.includes(q) || pinyin.includes(q);
}

/** 多选 */
const multiValue = ref<string[]>(['ts']);
/** 多选 + 可搜索 */
const multiFilterValue = ref<string[]>([]);
/** 最大标签数 */
const maxTagValue = ref<string[]>(['ts', 'py', 'go', 'rust']);
/** 最大标签数为 0 */
const maxTagZeroValue = ref<string[]>(['ts', 'py', 'go']);
/** 最大标签数 + 可搜索 */
const maxTagFilterValue = ref<string[]>(['react', 'vue', 'angular']);
/** 最大标签数 + 可清空 */
const maxTagClearValue = ref<string[]>(['apple', 'banana', 'orange', 'grape']);
/** 响应式最大标签数 */
const responsiveValue = ref<string[]>(['js', 'ts', 'py', 'go', 'rust', 'java', 'cpp']);
/** 响应式容器宽度 */
const responsiveWidth = ref(300);
/** 响应式 + 可搜索 */
const responsiveFilterValue = ref<string[]>(['react', 'vue', 'angular', 'svelte', 'solid']);
/** 响应式 + 可搜索容器宽度 */
const responsiveFilterWidth = ref(350);
/** 可清空 */
const clearValue = ref('');
/** 禁用 */
const disabledValue = ref('');
/** 禁用选项 */
const disabledOptValue = ref('');
/** 尺寸 - large */
const sizeLarge = ref('');
/** 尺寸 - default */
const sizeDefault = ref('');
/** 尺寸 - small */
const sizeSmall = ref('');
/** 数字值 */
const numberValue = ref<number | undefined>(undefined);
/** 自定义选项内容 */
const customValue = ref('');
/** 前缀插槽 */
const prefixValue = ref('');
/** 下拉框自定义类名 */
const popperValue = ref('');
/** 事件演示 */
const eventValue = ref<string[]>([]);
/** 大数据量 */
const largeValue = ref<number | undefined>(undefined);

/** 虚拟滚动选项数据类型 */
interface VirtualOption {
  value: number;
  label: string;
  disabled?: boolean;
}

/** 生成虚拟滚动测试数据 */
function generateVirtualOptions(count: number): VirtualOption[] {
  return Array.from({ length: count }, (_, i) => ({
    value: i + 1,
    label: `选项 ${String(i + 1).padStart(5, '0')}`,
    disabled: (i + 1) % 100 === 0,
  }));
}

/** 虚拟滚动 - options 模式数据（10000 条） */
const virtualOptions = ref(generateVirtualOptions(10000));
/** 虚拟滚动 - options 模式选中值 */
const virtualDataValue = ref<number | undefined>(undefined);
/** 虚拟滚动 - me-option 子组件模式数据（100 条） */
const virtualSlotOptions = ref(generateVirtualOptions(100));
/** 虚拟滚动 - me-option 子组件模式选中值 */
const virtualSlotValue = ref<number | undefined>(undefined);
/** 虚拟滚动 - 多选模式选中值 */
const virtualMultiValue = ref<number[]>([]);

/** placement - top */
const placementTopValue = ref('');
/** placement - top-start */
const placementTopStartValue = ref('');
/** placement - top-end */
const placementTopEndValue = ref('');
/** placement - bottom */
const placementBottomValue = ref('');
/** placement - bottom-start */
const placementBottomStartValue = ref('');
/** placement - bottom-end */
const placementBottomEndValue = ref('');
/** placement - left */
const placementLeftValue = ref('');
/** placement - right */
const placementRightValue = ref('');

/** 事件日志 */
const eventLogs = ref<string[]>([]);

/** 添加事件日志 */
function addLog(message: string) {
  const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  eventLogs.value.unshift(`[${time}] ${message}`);
  if (eventLogs.value.length > 20) {
    eventLogs.value.pop();
  }
}

/** change 事件 */
function onChangeEvent(value: OptionValue | OptionValue[]) {
  addLog(`change: ${JSON.stringify(value)}`);
}

/** clear 事件 */
function onClearEvent() {
  addLog('clear: 已清空');
}

/** visible-change 事件 */
function onVisibleChangeEvent(visible: boolean) {
  addLog(`visible-change: ${visible ? '展开' : '关闭'}`);
}

/** focus 事件 */
function onFocusEvent() {
  addLog('focus: 聚焦');
}

/** blur 事件 */
function onBlurEvent() {
  addLog('blur: 失焦');
}

/** remove-tag 事件 */
function onRemoveTagEvent(value: OptionValue) {
  addLog(`remove-tag: 移除了 ${value}`);
}
</script>

<style lang="less" scoped>
.play-root {
  padding: 24px;
  width: 1000px;
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

.play-select-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .me-select {
    width: 240px;
  }
}

.play-select-sizes {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.play-placement-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: -8px;
}

.play-placement-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 16px;
  margin-bottom: 8px;

  .play-label {
    margin-bottom: 4px;
  }

  .me-select {
    width: 160px;
  }
}

.play-select-sizes-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .me-select {
    width: 180px;
  }
}

.play-option-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.play-option-custom-tag {
  font-size: 12px;
  color: #909399;
}

.play-prefix-text {
  font-size: 13px;
  color: #909399;
}

.play-responsive-area {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
}

.play-responsive-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;

  > * {
    margin-right: 8px;
    margin-bottom: 4px;
  }
}

.play-responsive-wrapper {
  transition: width 0.3s ease;
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

.play-virtual-option {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.play-virtual-option-icon {
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

.play-virtual-option-text {
  flex: 1;
  font-size: 14px;
}

.play-virtual-option-id {
  color: #bbb;
  font-size: 12px;
  font-family: monospace;
}
</style>

<style lang="less">
/* 下拉框自定义样式（非 scoped） */
.play-custom-popper {
  border-color: #409eff !important;

  .me-select-dropdown__item.is-hovering {
    background-color: #ecf5ff;
  }
}
</style>
