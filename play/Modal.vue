<!-- ? Modal 对话框组件示例 -->
<template>
  <div class="play-modal">
    <h1>MeModal 对话框</h1>

    <!-- 组件形式 - 基础用法 -->
    <section class="play-section">
      <h2>组件形式 - 基础用法</h2>
      <p class="play-desc">通过 v-model:open 双向绑定弹窗显示状态</p>
      <div class="play-border">
        <me-button @click="basicOpen = true">打开弹窗</me-button>
        <me-modal v-model:open="basicOpen" title="基础弹窗" @confirm="onBasicOk" @cancel="onBasicCancel">
          <p>这是一个基础弹窗的内容</p>
          <p>可以通过 v-model:open 控制显示和隐藏</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 自定义宽度 -->
    <section class="play-section">
      <h2>组件形式 - 自定义宽度</h2>
      <p class="play-desc">通过 width 属性设置弹窗宽度</p>
      <div class="play-border">
        <me-button @click="widthOpen = true">打开宽弹窗（800px）</me-button>
        <me-modal v-model:open="widthOpen" title="自定义宽度" :width="800">
          <p>宽度为 800px 的弹窗</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 禁用遮罩关闭 -->
    <section class="play-section">
      <h2>组件形式 - 禁用遮罩关闭</h2>
      <p class="play-desc">通过 maskClosable 属性控制点击遮罩是否关闭</p>
      <div class="play-border">
        <me-button @click="maskOpen = true">打开弹窗（点击遮罩不关闭）</me-button>
        <me-modal v-model:open="maskOpen" title="禁用遮罩关闭" :mask-closable="false">
          <p>点击遮罩层不会关闭弹窗</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 无关闭按钮 -->
    <section class="play-section">
      <h2>组件形式 - 无关闭按钮</h2>
      <p class="play-desc">通过 closable 属性控制右上角关闭按钮</p>
      <div class="play-border">
        <me-button @click="closableOpen = true">打开弹窗（无关闭按钮）</me-button>
        <me-modal v-model:open="closableOpen" title="无关闭按钮" :closable="false">
          <p>右上角没有关闭按钮</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 自定义按钮文字 -->
    <section class="play-section">
      <h2>组件形式 - 自定义按钮文字</h2>
      <p class="play-desc">通过 confirmText 和 cancelText 自定义按钮文字</p>
      <div class="play-border">
        <me-button @click="customTextOpen = true">打开弹窗</me-button>
        <me-modal
          v-model:open="customTextOpen"
          title="自定义按钮文字"
          confirm-text="确认提交"
          cancel-text="返回"
          @confirm="onCustomOk"
        >
          <p>底部按钮文字已自定义</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 隐藏取消按钮 -->
    <section class="play-section">
      <h2>组件形式 - 隐藏取消按钮</h2>
      <p class="play-desc">通过 showCancel 属性控制是否显示取消按钮</p>
      <div class="play-border">
        <me-button @click="noCancelOpen = true">打开弹窗（仅确认）</me-button>
        <me-modal v-model:open="noCancelOpen" title="仅确认按钮" :show-cancel="false">
          <p>只显示确认按钮，没有取消按钮</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 自定义 footer -->
    <section class="play-section">
      <h2>组件形式 - 自定义 footer</h2>
      <p class="play-desc">通过 footer 插槽自定义底部内容</p>
      <div class="play-border">
        <me-button @click="customFooterOpen = true">打开弹窗</me-button>
        <me-modal v-model:open="customFooterOpen" title="自定义 footer">
          <p>底部内容通过插槽自定义</p>
          <template #footer>
            <me-button @click="customFooterOpen = false">关闭</me-button>
          </template>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 隐藏 footer -->
    <section class="play-section">
      <h2>组件形式 - 隐藏 footer</h2>
      <p class="play-desc">通过 :footer="null" 隐藏整个底部</p>
      <div class="play-border">
        <me-button @click="noFooterOpen = true">打开弹窗（无底部）</me-button>
        <me-modal v-model:open="noFooterOpen" title="无底部" :footer="null">
          <p>没有底部按钮区域</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 确认 loading -->
    <section class="play-section">
      <h2>组件形式 - 确认 loading</h2>
      <p class="play-desc">通过 confirm-loading 属性显示确认按钮加载状态</p>
      <div class="play-border">
        <me-button @click="loadingOpen = true">打开弹窗</me-button>
        <me-modal
          v-model:open="loadingOpen"
          title="确认 loading"
          :confirm-loading="isLoading"
          @confirm="handleLoadingOk"
        >
          <p>点击确认后按钮会显示 loading 状态，2 秒后关闭</p>
        </me-modal>
      </div>
    </section>

    <!-- 组件形式 - 自定义标题 -->
    <section class="play-section">
      <h2>组件形式 - 自定义标题</h2>
      <p class="play-desc">通过 title 插槽自定义标题内容</p>
      <div class="play-border">
        <me-button @click="customTitleOpen = true">打开弹窗</me-button>
        <me-modal v-model:open="customTitleOpen">
          <template #title>
            <span style="color: var(--me-color-primary)">自定义标题颜色</span>
          </template>
          <p>标题内容通过插槽自定义</p>
        </me-modal>
      </div>
    </section>

    <!-- 函数调用 - confirm -->
    <section class="play-section">
      <h2>函数调用 - MeModal.confirm</h2>
      <p class="play-desc">通过函数式调用确认对话框</p>
      <div class="play-border">
        <me-button @click="handleConfirm">打开确认对话框</me-button>
      </div>
    </section>

    <!-- 函数调用 - info -->
    <section class="play-section">
      <h2>函数调用 - MeModal.info</h2>
      <p class="play-desc">通过函数式调用信息提示</p>
      <div class="play-border">
        <me-button @click="handleInfo">打开信息提示</me-button>
      </div>
    </section>

    <!-- 函数调用 - success -->
    <section class="play-section">
      <h2>函数调用 - MeModal.success</h2>
      <p class="play-desc">通过函数式调用成功提示</p>
      <div class="play-border">
        <me-button @click="handleSuccess">打开成功提示</me-button>
      </div>
    </section>

    <!-- 函数调用 - warning -->
    <section class="play-section">
      <h2>函数调用 - MeModal.warning</h2>
      <p class="play-desc">通过函数式调用警告提示</p>
      <div class="play-border">
        <me-button @click="handleWarning">打开警告提示</me-button>
      </div>
    </section>

    <!-- 函数调用 - error -->
    <section class="play-section">
      <h2>函数调用 - MeModal.error</h2>
      <p class="play-desc">通过函数式调用错误提示</p>
      <div class="play-border">
        <me-button @click="handleError">打开错误提示</me-button>
      </div>
    </section>

    <!-- 函数调用 - 异步关闭 -->
    <section class="play-section">
      <h2>函数调用 - 异步关闭</h2>
      <p class="play-desc">onConfirm 返回 Promise 时会自动显示 loading，完成后关闭</p>
      <div class="play-border">
        <me-button @click="handleAsyncConfirm">打开异步确认</me-button>
      </div>
    </section>

    <!-- 函数调用 - 更新配置 -->
    <section class="play-section">
      <h2>函数调用 - 更新配置</h2>
      <p class="play-desc">通过返回实例的 update 方法动态更新弹窗配置</p>
      <div class="play-border">
        <me-button @click="handleUpdate">打开弹窗后更新内容</me-button>
      </div>
    </section>

    <!-- 函数调用 - 手动关闭 -->
    <section class="play-section">
      <h2>函数调用 - 手动关闭</h2>
      <p class="play-desc">通过返回实例的 close 方法手动关闭弹窗</p>
      <div class="play-border">
        <me-button @click="handleManualClose">打开弹窗（3秒后自动关闭）</me-button>
      </div>
    </section>

    <!-- 函数调用 - 自定义图标 -->
    <section class="play-section">
      <h2>函数调用 - 自定义图标</h2>
      <p class="play-desc">通过 icon 属性自定义标题前的图标，优先于类型默认图标</p>
      <div class="play-border">
        <me-button @click="handleCustomIcon">打开弹窗（自定义图标）</me-button>
      </div>
    </section>

    <!-- 函数调用 - 阻止关闭 -->
    <section class="play-section">
      <h2>函数调用 - 阻止关闭</h2>
      <p class="play-desc">onConfirm 返回 false 时阻止弹窗关闭，可用于表单校验等场景</p>
      <div class="play-border">
        <me-button @click="handlePreventClose">打开弹窗（确认不会关闭）</me-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { WarningFilled } from '@element-plus/icons-vue';

import { MeModal } from '../src/index.ts';

/** 基础弹窗 */
const basicOpen = ref(false);
/** 宽度弹窗 */
const widthOpen = ref(false);
/** 遮罩弹窗 */
const maskOpen = ref(false);
/** 关闭按钮弹窗 */
const closableOpen = ref(false);
/** 自定义文字弹窗 */
const customTextOpen = ref(false);
/** 无取消弹窗 */
const noCancelOpen = ref(false);
/** 自定义 footer 弹窗 */
const customFooterOpen = ref(false);
/** 无 footer 弹窗 */
const noFooterOpen = ref(false);
/** loading 弹窗 */
const loadingOpen = ref(false);
/** 自定义标题弹窗 */
const customTitleOpen = ref(false);

/** 确认 loading */
const isLoading = ref(false);

/** 基础确认 */
function onBasicOk() {
  console.log('基础弹窗确认');
  basicOpen.value = false;
}

/** 基础取消 */
function onBasicCancel() {
  console.log('基础弹窗取消');
}

/** 自定义确认 */
function onCustomOk() {
  console.log('自定义按钮确认');
  customTextOpen.value = false;
}

/** loading 确认 */
function handleLoadingOk() {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    loadingOpen.value = false;
  }, 2000);
}

/** confirm 函数调用 */
function handleConfirm() {
  MeModal.confirm({
    title: '确认操作',
    content: '确定要执行此操作吗？此操作不可撤销。',
    onConfirm: () => {
      console.log('确认操作');
    },
    onCancel: () => {
      console.log('取消操作');
    },
  });
}

/** info 函数调用 */
function handleInfo() {
  MeModal.info({
    title: '信息提示',
    content: '这是一条信息提示内容。',
  });
}

/** success 函数调用 */
function handleSuccess() {
  MeModal.success({
    title: '操作成功',
    content: '您的操作已成功完成。',
  });
}

/** warning 函数调用 */
function handleWarning() {
  MeModal.warning({
    title: '警告提示',
    content: '请注意，此操作可能存在风险。',
  });
}

/** error 函数调用 */
function handleError() {
  MeModal.error({
    title: '操作失败',
    content: '操作执行失败，请稍后重试。',
  });
}

/** 异步确认 */
function handleAsyncConfirm() {
  MeModal.confirm({
    title: '异步确认',
    content: '点击确认后会模拟请求，2 秒后自动关闭。',
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('异步操作完成');
    },
  });
}

/** 更新配置 */
function handleUpdate() {
  const instance = MeModal.confirm({
    title: '初始标题',
    content: '2 秒后更新弹窗内容...',
  });

  setTimeout(() => {
    instance.update({
      title: '已更新标题',
      content: '弹窗内容已更新！',
    });
  }, 2000);
}

/** 手动关闭 */
function handleManualClose() {
  const instance = MeModal.info({
    title: '手动关闭',
    content: '3 秒后自动关闭此弹窗。',
  });

  setTimeout(() => {
    instance.close();
  }, 3000);
}

/** 自定义图标 */
function handleCustomIcon() {
  MeModal.confirm({
    title: '自定义图标',
    content: '使用自定义图标替代默认的类型图标。',
    icon: WarningFilled,
  });
}

/** 阻止关闭 */
function handlePreventClose() {
  MeModal.confirm({
    title: '阻止关闭',
    content: '点击确认后弹窗不会关闭，请手动关闭。',
    onConfirm: () => {
      console.log('确认被点击，但返回 false 阻止关闭');
      return false;
    },
  });
}
</script>

<style lang="less" scoped>
.play-modal {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.play-section {
  margin-bottom: 24px;

  h2 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}

.play-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.play-border {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
