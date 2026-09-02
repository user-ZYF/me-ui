---
description: me-ui 组件库开发规范，新增/修改组件时必须遵循
---

# me-ui 组件库开发规范

## 1. 新增组件时的同步更新

新增组件时，必须同步更新以下四个文件：

### 1.1 `src/components.d.ts`

- 添加组件的 `import type` 语句
- 在 `GlobalComponents` 接口中注册组件类型

```typescript
// 添加导入
import type { MeNewComponent } from './components/new-component';

// 在 GlobalComponents 中添加
MeNewComponent: typeof MeNewComponent;
```

### 1.2 `src/index.ts`

- 添加组件的 `import` 语句
- 将组件加入 `components` 数组
- 在 `export` 语句中导出组件

```typescript
import { MeNewComponent } from './components/new-component';

const components = [/* ... */, MeNewComponent];

export { /* ... */, MeNewComponent };
```

### 1.3 `package.json`

在 `exports` 字段中添加组件的子路径导出：

```json
"./new-component": {
  "types": "./dist/new-component.d.ts",
  "import": "./dist/new-component.js"
}
```

### 1.4 `vite.config.ts`

在 `build.lib.entry` 中添加组件的构建入口：

```typescript
'new-component': resolve(__dirname, 'src/components/new-component/index.ts'),
```

## 2. 参考 Element Plus 实现

- 新增组件时，参考 [Element Plus](https://github.com/element-plus/element-plus) 官方对应组件的实现方式
- 初始实现**只包含核心功能**，不需要一次性对齐所有特性
- 后续按需迭代补充高级功能

## 3. 组件目录结构

每个组件目录下的文件组织如下：

```
src/components/component-name/
├── index.ts                  # 仅导出允许外部使用的组件，内部使用的组件不导出
├── ComponentName.vue         # 主组件
├── component-name.ts          # Props / Emits 定义（与组件内容分离）
├── component-name.less        # 组件及子组件的统一样式文件（唯一）
├── constants.ts               # 组件独有常量（InjectionKey、默认值等）
├── types.ts                   # 类型定义（interface、type 等）
├── hooks/                     # 组件 hooks
│   └── use-component-xxx.ts   # 具体 hook 文件
└── components/                # 子组件目录
    ├── SubComponent.vue       # 子组件内容
    └── sub-component.ts       # 子组件 Props 定义（与主组件一样，内容与 props 分离）
```

### 文件职责说明

- **`index.ts`**：使用 `withInstall` 包装组件并导出，仅导出允许外部使用的组件。内部使用的子组件**不导出**。同时按需 `export *` 导出 types、constants、hooks 等
- **`ComponentName.vue`**：组件模板、逻辑（`<template>` + `<script setup lang="ts">`）
- **`component-name.less`**：组件及所有子组件的统一样式文件，**一个组件目录下只允许存在一个 less 文件**，子组件样式也统一写在此文件中，不单独创建
- **`component-name.ts`**：Props 和 Emits 的定义，使用 `as const` 定义，并导出对应的 `ExtractPropTypes` 类型
- **`constants.ts`**：组件独有的常量，如 `InjectionKey`、默认配置值等
- **`types.ts`**：组件相关的 `interface`、`type` 定义
- **`components/`**：子组件目录，每个子组件为独立目录，Props 定义与组件内容分开书写

### index.ts 导出规范

```typescript
import '@me-ui/setup';
import { withInstall } from '@me-ui/utils/install';
import ComponentName from './ComponentName.vue';
import './component-name.less';

// 使用 withInstall 包装，支持 app.use() 注册
export const MeComponentName = withInstall(ComponentName);
export default MeComponentName;

// 按需导出类型、常量、hooks（仅导出允许外部使用的）
export * from './component-name';
export * from './types';
export * from './constants';
export * from './hooks';
```

## 4. 修改已有组件时的联动更新

修改已有组件时，必须确保所有使用到该组件的地方同步更新，包括但不限于：

- **其他组件**：组件间存在引用关系的，需同步更新引用方式
- **示例代码**：`play/` 目录下的示例文件需同步更新
- **类型导出**：如果修改了 Props/Emits/类型定义，需检查 `index.ts` 的导出是否需要调整
- **构建配置**：如果组件的导出结构发生变化，需检查 `vite.config.ts` 和 `package.json` 是否需要调整

## 5. CSS 类名使用 useNamespace

- 所有组件的 CSS 类名必须通过 `useNamespace` hook 生成
- 禁止在模板中硬编码类名字符串

```vue
<template>
  <div :class="[ns.b.value, ns.is('active', isActive)]">
    <span :class="ns.e('label')">文本</span>
  </div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@me-ui/hooks/use-namespace';

const ns = useNamespace('component-name');
</script>
```

### useNamespace API

| 方法 | 说明 | 示例输出 |
|------|------|----------|
| `ns.b.value` | block 类名 | `me-component-name` |
| `ns.m('modifier')` | block--modifier | `me-component-name--primary` |
| `ns.e('element')` | block__element | `me-component-name__icon` |
| `ns.em('el', 'mod')` | block__element--modifier | `me-component-name__icon--active` |
| `ns.is('loading', true)` | 状态类名 | `is-loading` |

## 6. 组件联动考虑

新增组件时，必须考虑与已有逻辑的联动：

- **Form 表单联动**：表单类组件（Input、Select、Checkbox 等）需要支持 `useFormItem`、`useFormSize`、`useFormDisabled`，实现 size 继承和 disabled 继承
- **ConfigProvider 联动**：组件需通过 `useNamespace` 自动继承 ConfigProvider 的 `namespace` 和 `size` 配置
- **Tooltip 联动**：需要弹出层的组件（如 Select）应复用 Tooltip 组件作为弹出层基础设施
- **Scrollbar 联动**：需要滚动区域的组件应复用 Scrollbar 组件
- **VirtualList 联动**：大数据量列表场景应复用 VirtualList 组件

### Form 联动示例

```vue
<script lang="ts" setup>
import { computed } from 'vue';
import { useFormItem, useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';

const props = defineProps(componentProps);

const { form } = useFormItem();
const actualSize = useFormSize(computed(() => props.size));
const actualDisabled = useFormDisabled(computed(() => props.disabled));
</script>
```

## 7. Props 定义规范

Props 定义与组件内容分离，存放在单独的 `.ts` 文件中：

```typescript
// component-name.ts
import type { ExtractPropTypes, PropType } from 'vue';

/** ComponentName Props 定义 */
export const componentProps = {
  /** 属性描述 */
  value: {
    type: String,
    default: '',
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
} as const;

/** ComponentName Props 类型 */
export type ComponentProps = ExtractPropTypes<typeof componentProps>;

/** ComponentName Emits 定义 */
export const componentEmits = {
  /** 事件描述 */
  change: (value: string) => value,
} as const;

/** ComponentName Emits 类型 */
export type ComponentEmits = typeof componentEmits;
```

## 8. 注释规范

- **函数和变量定义**：如果有注释，必须使用 JSDoc 注释（`/** ... */`）
- **作用域内的注释**：函数体内部的注释使用单行注释（`// ...`），不使用 JSDoc

```typescript
/** 用户名称 */
const userName = ref('');

/** 获取用户数据 */
function fetchUserData() {
  // 发起请求
  const res = await api.getUser();
  // 处理返回结果
  userName.value = res.name;
}
```

## 9. 命名规范

- **组件名称**：`Me` 前缀 + `PascalCase`，如 `MeButton`、`MeSelect`
- **组件文件**：`PascalCase`，如 `Button.vue`、`Select.vue`
- **Props/Emits 文件**：`kebab-case`，如 `button.ts`、`select.ts`
- **样式文件**：`kebab-case`，如 `button.less`、`select.less`
- **常量文件**：固定命名为 `constants.ts`
- **类型文件**：固定命名为 `types.ts`
- **hooks 文件**：`kebab-case`，如 `kebab-case.ts`
