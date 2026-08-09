import { withInstall } from '@me-ui/utils/install';

import ConfigProvider from './ConfigProvider.vue';

import '@me-ui/styles/var.less';

export const MeConfigProvider = withInstall(ConfigProvider);

export default MeConfigProvider;

export * from './types';
export * from './config-provider';
export * from './hooks/use-config-provider';
