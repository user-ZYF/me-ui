import type { PropType } from 'vue';

import { componentSizes } from '@me-ui/utils/types';

import type { ThemeTokens } from './types';

/** ConfigProvider Props 定义 */
export const configProviderProps = {
  /** 主题 Token 配置，覆盖 CSS 变量 */
  theme: {
    type: Object as PropType<ThemeTokens>,
    default: () => ({}),
  },
  /** 全局组件尺寸 */
  size: {
    type: String as PropType<typeof componentSizes[number]>,
    values: componentSizes,
    default: 'default',
  },
  /** CSS 类名命名空间前缀 */
  namespace: {
    type: String,
    default: 'me',
  },
} as const;
