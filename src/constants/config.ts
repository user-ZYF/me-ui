/** 默认命名空间前缀 */
export const defaultNamespace = 'me';

/** 组件尺寸可选值 */
export const componentSizes = ['large', 'default', 'small'] as const;

/** 默认组件尺寸 */
export const defaultComponentSize = 'default';

/** 组件大小 */
export type ComponentSize = (typeof componentSizes)[number];

/** 组件类型可选值 */
export const componentTypes = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;

/** 组件类型 */
export type ComponentType = (typeof componentTypes)[number];
