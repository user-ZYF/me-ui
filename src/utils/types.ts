import type { Component, Plugin } from 'vue';

/** 可安装的组件类型 */
export type SFCWithInstall<T extends Component> = T & Plugin;
