<!-- Form 表单组件示例 -->
<template>
  <div class="play-form">
    <h1>MeForm 表单</h1>

    <!-- 基础用法 -->
    <section class="play-section">
      <h2>基础用法</h2>
      <p class="play-desc">通过 data 绑定表单数据对象，FormItem 的 prop-path 对应字段路径</p>
      <div class="play-border">
        <me-form :data="basicForm">
          <me-form-item label="用户名" prop-path="username">
            <me-input v-model="basicForm.username" placeholder="请输入用户名" />
          </me-form-item>
          <me-form-item label="邮箱" prop-path="email">
            <me-input v-model="basicForm.email" placeholder="请输入邮箱" />
          </me-form-item>
        </me-form>
        <p class="play-result">表单数据：{{ basicForm }}</p>
      </div>
    </section>

    <!-- 表单校验 -->
    <section class="play-section">
      <h2>表单校验</h2>
      <p class="play-desc">通过 rules 设置校验规则，支持 required、pattern、len、自定义 validator、异步校验等</p>
      <div class="play-border">
        <me-form ref="ruleFormRef" :data="ruleForm" :rules="rules" scroll-to-error @validate="onValidate">
          <me-form-item label="用户名" prop-path="username">
            <me-input v-model="ruleForm.username" placeholder="必填，blur 触发" />
          </me-form-item>
          <me-form-item label="密码" prop-path="password">
            <me-input v-model="ruleForm.password" type="password" show-password placeholder="6-20 位" />
          </me-form-item>
          <me-form-item label="确认密码" prop-path="confirm">
            <me-input v-model="ruleForm.confirm" type="password" show-password placeholder="需与密码一致" />
          </me-form-item>
          <me-form-item label="年龄" prop-path="age">
            <me-input v-model="ruleForm.age" type="number" placeholder="18-60 之间" />
          </me-form-item>
          <me-form-item label="城市" prop-path="city">
            <me-select v-model="ruleForm.city" :options="cityOptions" clearable placeholder="请选择城市" />
          </me-form-item>
          <me-form-item label="性别" prop-path="gender">
            <me-radio-group v-model="ruleForm.gender">
              <me-radio value="male" label="男" />
              <me-radio value="female" label="女" />
            </me-radio-group>
          </me-form-item>
          <me-form-item label="爱好" prop-path="hobbies">
            <me-checkbox-group v-model="ruleForm.hobbies">
              <me-checkbox value="read" label="阅读" />
              <me-checkbox value="game" label="游戏" />
              <me-checkbox value="sport" label="运动" />
            </me-checkbox-group>
          </me-form-item>
          <me-form-item label="协议" prop-path="agree">
            <me-checkbox v-model="ruleForm.agree" label="我已阅读并同意用户协议" />
          </me-form-item>
          <me-form-item>
            <me-button type="primary" @click="submitForm">提交</me-button>
            <me-button @click="resetForm">重置</me-button>
            <me-button @click="clearValidate">清除校验</me-button>
          </me-form-item>
        </me-form>
        <p class="play-result">校验结果：{{ validateResult }}</p>
        <p class="play-result">validate 事件：{{ validateLog }}</p>
      </div>
    </section>

    <!-- 单字段校验 -->
    <section class="play-section">
      <h2>指定字段校验 / 滚动定位</h2>
      <p class="play-desc">validate 校验指定字段，scrollToProp 滚动到指定字段</p>
      <div class="play-border">
        <me-button size="small" @click="validatePropOnly('username')">仅校验用户名</me-button>
        <me-button size="small" @click="validatePropOnly(['password', 'confirm'])">校验密码与确认密码</me-button>
        <me-button size="small" @click="scrollToAgree">滚动到"协议"字段</me-button>
      </div>
    </section>

    <!-- FormItem 级 rules -->
    <section class="play-section">
      <h2>FormItem 级 rules</h2>
      <p class="play-desc">rules 也可以直接设置在 FormItem 上，与 Form 的 rules 合并</p>
      <div class="play-border">
        <me-form :data="itemRuleForm">
          <me-form-item label="手机号" prop-path="phone" :rules="phoneRules">
            <me-input v-model="itemRuleForm.phone" placeholder="请输入 11 位手机号" />
          </me-form-item>
          <me-form-item label="备注" prop-path="remark">
            <me-input v-model="itemRuleForm.remark" placeholder="无校验规则" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 自定义错误显示 -->
    <section class="play-section">
      <h2>自定义校验状态与错误信息</h2>
      <p class="play-desc">通过 error-text 设置错误文案，validateStatus 控制校验状态，#error 插槽自定义渲染</p>
      <div class="play-border">
        <me-form :data="customForm">
          <me-form-item label="服务器校验" prop-path="code" :error-text="serverError" :validate-status="serverStatus">
            <me-input v-model="customForm.code" placeholder="输入后点击右侧按钮模拟服务端校验" />
            <me-button size="small" style="margin-left: 8px" @click="mockServerValidate">模拟校验</me-button>
          </me-form-item>
          <me-form-item label="自定义错误" prop-path="custom" :rules="[{ required: true, message: '该字段不能为空', trigger: 'blur' }]">
            <me-input v-model="customForm.custom" placeholder="失焦触发必填校验" />
            <template #error="{ error }">
              <span class="play-custom-error">⚠ {{ error }}</span>
            </template>
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 隐藏必填星号 -->
    <section class="play-section">
      <h2>隐藏必填星号</h2>
      <p class="play-desc">hide-required-asterisk 隐藏必填项的星号标记</p>
      <div class="play-border">
        <me-form :data="asteriskForm" :rules="asteriskRules" hide-required-asterisk>
          <me-form-item label="必填项" prop-path="required">
            <me-input v-model="asteriskForm.required" placeholder="必填但无星号" />
          </me-form-item>
          <me-form-item label="非必填" prop-path="optional">
            <me-input v-model="asteriskForm.optional" placeholder="非必填" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- FormItem required 标记 -->
    <section class="play-section">
      <h2>required 标记</h2>
      <p class="play-desc">不设置 rules 时可通过 required 仅显示必填星号（不参与校验）</p>
      <div class="play-border">
        <me-form :data="requiredForm">
          <me-form-item label="仅星号" prop-path="mark" required>
            <me-input v-model="requiredForm.mark" placeholder="有星号但不校验" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 不同尺寸 -->
    <section class="play-section">
      <h2>表单尺寸</h2>
      <p class="play-desc">size 统一控制表单内组件尺寸：large / default / small</p>
      <div class="play-border">
        <div class="play-size-btns">
          <me-button size="small" @click="formSize = 'large'">large</me-button>
          <me-button size="small" @click="formSize = 'default'">default</me-button>
          <me-button size="small" @click="formSize = 'small'">small</me-button>
        </div>
        <me-form :data="sizeForm" :size="formSize">
          <me-form-item label="输入框" prop-path="input">
            <me-input v-model="sizeForm.input" placeholder="尺寸跟随表单" />
          </me-form-item>
          <me-form-item label="选择器" prop-path="select">
            <me-select v-model="sizeForm.select" :options="cityOptions" placeholder="尺寸跟随表单" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 禁用 -->
    <section class="play-section">
      <h2>禁用表单</h2>
      <p class="play-desc">disabled 禁用表单内所有组件</p>
      <div class="play-border">
        <me-form :data="disabledForm" disabled>
          <me-form-item label="输入框" prop-path="input">
            <me-input v-model="disabledForm.input" placeholder="禁用" />
          </me-form-item>
          <me-form-item label="选择器" prop-path="select">
            <me-select v-model="disabledForm.select" :options="cityOptions" placeholder="禁用" />
          </me-form-item>
          <me-form-item label="单选" prop-path="radio">
            <me-radio-group v-model="disabledForm.radio">
              <me-radio value="a" label="选项 A" />
              <me-radio value="b" label="选项 B" />
            </me-radio-group>
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 嵌套字段 -->
    <section class="play-section">
      <h2>嵌套字段路径</h2>
      <p class="play-desc">prop-path 支持数组形式访问嵌套字段，如 ['address', 'detail']</p>
      <div class="play-border">
        <me-form ref="nestedFormRef" :data="nestedForm" :rules="nestedRules">
          <me-form-item label="省市区" :prop-path="['address', 'region']">
            <me-select v-model="nestedForm.address.region" :options="regionOptions" placeholder="请选择" />
          </me-form-item>
          <me-form-item label="详细地址" :prop-path="['address', 'detail']">
            <me-input v-model="nestedForm.address.detail" placeholder="街道、门牌号等" />
          </me-form-item>
          <me-form-item>
            <me-button type="primary" @click="submitNested">校验嵌套表单</me-button>
            <me-button @click="nestedFormRef?.resetFormItems()">重置</me-button>
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- showErrorMessage 控制错误提示 -->
    <section class="play-section">
      <h2>showErrorMessage 控制错误提示</h2>
      <p class="play-desc">Form 或 FormItem 上的 show-error-message 控制是否显示校验错误信息（状态仍保留）</p>
      <div class="play-border">
        <div class="play-size-btns">
          <me-checkbox v-model="formShowMsg" label="Form 级 showErrorMessage" />
          <me-checkbox v-model="itemShowMsg" label="FormItem 级 showErrorMessage" />
        </div>
        <me-form :data="showMsgForm" :rules="showMsgRules" :show-error-message="formShowMsg">
          <me-form-item label="跟随 Form" prop-path="a">
            <me-input v-model="showMsgForm.a" placeholder="清空后失焦触发校验" />
          </me-form-item>
          <me-form-item label="独立控制" prop-path="b" :show-error-message="itemShowMsg">
            <me-input v-model="showMsgForm.b" placeholder="清空后失焦触发校验" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- rules 动态变化 -->
    <section class="play-section">
      <h2>validateOnRuleChange</h2>
      <p class="play-desc">rules 变化时自动重新校验，设为 false 可关闭该行为</p>
      <div class="play-border">
        <div class="play-size-btns">
          <me-checkbox v-model="dynRequired" label="将邮箱设为必填" />
          <me-checkbox v-model="dynAutoValidate" label="validateOnRuleChange" />
        </div>
        <me-form :data="dynRuleForm" :rules="dynRules" :validate-on-rule-change="dynAutoValidate">
          <me-form-item label="邮箱" prop-path="email">
            <me-input v-model="dynRuleForm.email" placeholder="切换上方必填开关观察校验" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- FormItem size / label 插槽 / for -->
    <section class="play-section">
      <h2>FormItem 尺寸 / label 插槽 / for 属性</h2>
      <p class="play-desc">FormItem 的 size 覆盖 Form 尺寸；#label 自定义标签；for 关联控件 id</p>
      <div class="play-border">
        <me-form :data="itemSizeForm" size="small">
          <me-form-item label="跟随表单（small）" prop-path="a">
            <me-input v-model="itemSizeForm.a" placeholder="small" />
          </me-form-item>
          <me-form-item prop-path="b" size="large" label-for="custom-input">
            <template #label="{ label }">
              <span class="play-custom-label">★ {{ label }}</span>
            </template>
            <me-input id="custom-input" v-model="itemSizeForm.b" placeholder="large，label 插槽" />
          </me-form-item>
        </me-form>
      </div>
    </section>

    <!-- 动态增减字段 -->
    <section class="play-section">
      <h2>动态字段与部分重置</h2>
      <p class="play-desc">动态增删 FormItem 时缓存初始值；resetFormItems / clearValidate 支持指定字段</p>
      <div class="play-border">
        <div class="play-size-btns">
          <me-checkbox v-model="showExtra" label="显示额外字段" />
        </div>
        <me-form ref="dynFormRef" :data="dynForm" :rules="dynFormRules">
          <me-form-item label="固定字段" prop-path="fixed">
            <me-input v-model="dynForm.fixed" placeholder="始终存在" />
          </me-form-item>
          <me-form-item v-if="showExtra" label="动态字段" prop-path="extra">
            <me-input v-model="dynForm.extra" placeholder="勾选后出现，初始值会被缓存" />
          </me-form-item>
          <me-form-item>
            <me-button type="primary" size="small" @click="dynFormRef?.validate().catch(() => {})">校验</me-button>
            <me-button size="small" @click="dynFormRef?.resetFormItems()">全部重置</me-button>
            <me-button size="small" @click="dynFormRef?.resetFormItems('extra')">仅重置动态字段</me-button>
            <me-button size="small" @click="dynFormRef?.clearValidate('fixed')">清除固定字段校验</me-button>
          </me-form-item>
        </me-form>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import type { MeForm } from '@me-ui/components/form';
import type { FormItemRule, FormRules } from '@me-ui/components/form';
import type { ComponentSize } from '@me-ui/types/config';
import type { SelectOption } from '../src/components/select/types';
import type { FormItemPropPath } from '@me-ui/components/form';

/** 城市选项 */
const cityOptions: SelectOption[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
];

/** 省市区选项 */
const regionOptions: SelectOption[] = [
  { value: 'hd', label: '华东' },
  { value: 'hb', label: '华北' },
  { value: 'hn', label: '华南' },
];

// ========== 基础用法 ==========
const basicForm = reactive({ username: '', email: '' });

// ========== 表单校验 ==========
const ruleFormRef = ref<InstanceType<typeof MeForm>>();
const ruleForm = reactive({
  username: '',
  password: '',
  confirm: '',
  age: '',
  city: '',
  gender: '',
  hobbies: [] as string[],
  agree: false,
});

/** 确认密码校验器 */
const validateConfirm: FormItemRule['validator'] = (_rule, value, callback) => {
  if (value !== ruleForm.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

/** 异步校验器（模拟服务端） */
const validateUsername: FormItemRule['asyncValidator'] = (_rule, value) =>
  new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (value === 'admin') {
        reject(new Error('该用户名已被占用'));
      } else {
        resolve();
      }
    }, 500);
  });

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
    { asyncValidator: validateUsername, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirm: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    {
      validator: (_r, v, cb) => {
        const n = Number(v);
        if (Number.isNaN(n) || n < 18 || n > 60) cb(new Error('年龄需在 18-60 之间'));
        else cb();
      },
      trigger: 'blur',
    },
  ],
  city: [{ required: true, message: '请选择城市', trigger: 'change' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  hobbies: [{ type: 'array', required: true, min: 1, message: '请至少选择一个爱好', trigger: 'change' }],
  agree: [
    {
      validator: (_r, v, cb) => (v ? cb() : cb(new Error('请同意用户协议'))),
      trigger: 'change',
    },
  ],
};

const validateResult = ref('尚未校验');
const validateLog = ref('');

function onValidate(propPath: FormItemPropPath, isValid: boolean, message: string) {
  validateLog.value = `字段 ${propPath}：${isValid ? '通过' : `失败 - ${message}`}`;
}

async function submitForm() {
  try {
    const valid = await ruleFormRef.value?.validate();
    validateResult.value = valid ? '✅ 校验通过' : '❌ 校验失败';
  } catch (invalidFields) {
    validateResult.value = `❌ 校验失败：${Object.keys(invalidFields as object).join(', ')}`;
  }
}

function resetForm() {
  ruleFormRef.value?.resetFormItems();
  validateResult.value = '已重置';
}

function clearValidate() {
  ruleFormRef.value?.clearValidate();
  validateResult.value = '已清除校验信息';
}

async function validatePropOnly(propPath: FormItemPropPath) {
  try {
    const valid = await ruleFormRef.value?.validate(propPath);
    validateResult.value = valid ? `✅ 字段 ${propPath} 校验通过` : '❌ 校验失败';
  } catch (invalidFields) {
    validateResult.value = `❌ 校验失败：${Object.keys(invalidFields as object).join(', ')}`;
  }
}

function scrollToAgree() {
  ruleFormRef.value?.scrollToProp('agree');
}

// ========== FormItem 级 rules ==========
const itemRuleForm = reactive({ phone: '', remark: '' });
const phoneRules: FormItemRule[] = [
  { required: true, message: '请输入手机号', trigger: 'blur' },
  { pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' },
];

// ========== 自定义校验状态 ==========
const customForm = reactive({ code: '', custom: '' });
const serverError = ref('');
const serverStatus = ref<'' | 'error' | 'validating' | 'success'>('');

function mockServerValidate() {
  serverStatus.value = 'validating';
  serverError.value = '';
  setTimeout(() => {
    if (customForm.code === '123456') {
      serverStatus.value = 'success';
      serverError.value = '';
    } else {
      serverStatus.value = 'error';
      serverError.value = '验证码错误（正确值：123456）';
    }
  }, 800);
}

// ========== 隐藏星号 ==========
const asteriskForm = reactive({ required: '', optional: '' });
const asteriskRules: FormRules = {
  required: [{ required: true, message: '必填项', trigger: 'blur' }],
};

// ========== required 标记 ==========
const requiredForm = reactive({ mark: '' });

// ========== 尺寸 ==========
const formSize = ref<ComponentSize>('default');
const sizeForm = reactive({ input: '', select: '' });

// ========== 禁用 ==========
const disabledForm = reactive({ input: '禁用的值', select: '', radio: 'a' });

// ========== 嵌套字段 ==========
const nestedFormRef = ref<InstanceType<typeof MeForm>>();
const nestedForm = reactive({
  address: { region: '', detail: '' },
});
const nestedRules: FormRules = {
  'address.region': [{ required: true, message: '请选择省市区', trigger: 'change' }],
  'address.detail': [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
};

async function submitNested() {
  try {
    await nestedFormRef.value?.validate();
  } catch {
    // 校验失败信息由 FormItem 展示
  }
}

// ========== showErrorMessage ==========
const formShowMsg = ref(true);
const itemShowMsg = ref(true);
const showMsgForm = reactive({ a: '', b: '' });
const showMsgRules: FormRules = {
  a: [{ required: true, message: 'Form 级错误提示', trigger: 'blur' }],
  b: [{ required: true, message: 'FormItem 级错误提示', trigger: 'blur' }],
};

// ========== validateOnRuleChange ==========
const dynRequired = ref(false);
const dynAutoValidate = ref(true);
const dynRuleForm = reactive({ email: '' });
const dynRules = computed<FormRules>(() => ({
  email: dynRequired.value
    ? [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
      ]
    : [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
}));

// ========== FormItem size / label 插槽 / for ==========
const itemSizeForm = reactive({ a: '', b: '' });

// ========== 动态字段与部分重置 ==========
const dynFormRef = ref<InstanceType<typeof MeForm>>();
const showExtra = ref(false);
const dynForm = reactive({ fixed: '', extra: '' });
const dynFormRules: FormRules = {
  fixed: [{ required: true, message: '请输入固定字段', trigger: 'blur' }],
  extra: [{ required: true, message: '请输入动态字段', trigger: 'blur' }],
};
</script>

<style lang="less" scoped>
.play-form {
  padding: 24px;
  max-width: 720px;
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

.play-result {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
  word-break: break-all;
}

.play-size-btns {
  margin-bottom: 16px;

  .me-button {
    margin-right: 8px;
  }
}

.play-custom-error {
  font-size: 12px;
  color: #e6a23c;
}

.play-custom-label {
  color: #409eff;
  font-weight: 600;
}

.me-button + .me-button {
  margin-left: 8px;
}
</style>
