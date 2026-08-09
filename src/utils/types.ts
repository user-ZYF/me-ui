import type { Component, Plugin } from 'vue';

/** 可安装的组件类型 */
export type SFCWithInstall<T extends Component> = T & Plugin;

/** 组件尺寸可选值 */
export const componentSizes = ['large', 'default', 'small'] as const;

/** 组件大小 */
export type ComponentSize = (typeof componentSizes)[number];

/** 组件类型可选值 */
export const componentTypes = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;

/** 组件类型 */
export type ComponentType = (typeof componentTypes)[number];
