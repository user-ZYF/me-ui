<!-- ? Playground 调试页面 -->
<template>
  <div class="playground">
    <h1>Me UI Playground</h1>

    <MeConfigProvider :theme="theme" size="large">
      <!-- 残留 error 状态清理演示 -->
      <section>
        <h2>残留 error 状态清理演示（resetField）</h2>
        <p style="font-size: 13px; color: #909399; margin-bottom: 12px">
          1. 先点击「触发 blur 校验」让 username 产生 error 状态<br />
          2. 再点击「移除规则」动态移除 username 的校验规则<br />
          3. 最后点击「整体校验」— 此时 username 没有规则，validate('') 直接返回 true，<br />
          &nbsp;&nbsp;&nbsp;但 validateState 仍残留 'error'，所以会触发 resetField 清理
        </p>
        <me-form :model="demoForm" :rules="demoRules" ref="demoFormRef">
          <me-form-item label="用户名" name="username">
            <me-input v-model="demoForm.username" placeholder="输入后清空触发 blur 校验" />
          </me-form-item>
          <me-form-item label="邮箱" name="email">
            <me-input v-model="demoForm.email" placeholder="随意输入" />
          </me-form-item>
          <me-form-item>
            <me-button @click="handleTriggerBlur">触发 blur 校验</me-button>
            <me-button @click="handleRemoveRules">移除规则</me-button>
            <me-button type="primary" @click="handleDemoValidate">整体校验</me-button>
          </me-form-item>
        </me-form>
      </section>
    </MeConfigProvider>

    <!-- Element Plus 相同示例 -->
    <section>
      <h2>Element Plus 相同示例（对照组）</h2>
      <p style="font-size: 13px; color: #909399; margin-bottom: 12px">
        同样的操作流程，观察 Element Plus 的行为是否一致
      </p>
      <el-form :model="epForm" :rules="epRules" ref="epFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="epForm.username" placeholder="输入后清空触发 blur 校验" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="epForm.email" placeholder="随意输入" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleEpTriggerBlur">触发 blur 校验</el-button>
          <el-button @click="handleEpRemoveRules">移除规则</el-button>
          <el-button type="primary" @click="handleEpValidate">整体校验</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import MeButton from '../src/components/button';
import MeConfigProvider from '../src/components/config-provider';
import MeForm from '../src/components/form';
import MeFormItem from '../src/components/form/FormItem.vue';
import MeInput from '../src/components/input';

import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';

import 'element-plus/dist/index.css';

defineOptions({ name: 'PlaygroundApp' });

/** Form 实例类型 */
type FormInstance = InstanceType<typeof MeForm>;

/** 自定义主色 */
const primaryColor = ref('#f56c6c');

/** 主题 Token 配置 */
const theme = computed(() => ({
  colorPrimary: primaryColor.value,
}));

/* ==================== 残留 error 状态清理演示 ==================== */
/** 演示表单 ref */
const demoFormRef = ref<FormInstance>();
/** 演示表单数据 */
const demoForm = reactive({
  username: '',
  email: '',
});
/** 演示表单规则 */
const demoRules = ref<Record<string, any>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
});

/** 触发 username 的 blur 校验（让 username 产生 error 状态） */
function handleTriggerBlur() {
  demoForm.username = '';
  demoFormRef.value?.validateField('username');
}

/** 移除 username 的校验规则 */
function handleRemoveRules() {
  demoRules.value = { ...demoRules.value, username: [] };
}

/** 整体校验（触发 resetField 清理逻辑） */
function handleDemoValidate() {
  demoFormRef.value
    ?.validate()
    .then(() => {
      console.log('校验通过');
    })
    .catch((err: any) => {
      console.log('校验失败', err);
    });
}

/* ==================== Element Plus 相同示例 ==================== */
/** EP Form 实例类型 */
type EpFormInstance = InstanceType<typeof ElForm>;
/** EP 演示表单 ref */
const epFormRef = ref<EpFormInstance>();
/** EP 演示表单数据 */
const epForm = reactive({
  username: '',
  email: '',
});
/** EP 演示表单规则 */
const epRules = ref<Record<string, any>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
});

/** EP 触发 username 的 blur 校验 */
function handleEpTriggerBlur() {
  epForm.username = '';
  epFormRef.value?.validateField('username');
}

/** EP 移除 username 的校验规则 */
function handleEpRemoveRules() {
  epRules.value = { ...epRules.value, username: [] };
}

/** EP 整体校验 */
function handleEpValidate() {
  epFormRef.value
    ?.validate()
    .then(() => {
      console.log('EP 校验通过');
    })
    .catch((err: any) => {
      console.log('EP 校验失败', err);
    });
}
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

.form-size-wrapper {
  display: flex;
  flex-direction: column;
}

.form-size-wrapper .me-form {
  margin-bottom: 16px;
}

.event-log {
  margin-top: 12px;
  padding: 12px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
}

.event-log p {
  margin: 4px 0;
}

.me-form .me-button + .me-button {
  margin-left: 12px;
}
</style>
