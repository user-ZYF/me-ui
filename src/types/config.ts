/** 组件大小 */
export type ComponentSize = 'large' | 'default' | 'small';

/** 组件类型 */
export type ComponentType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

/** Token 配置项类型 */
export interface TokenConfigItem {
  /** CSS 变量名 */
  cssVar: string;
  /** 默认值 */
  default: string;
  /** 是否具有派生色 */
  derived?: boolean;
}
