import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import ConfigProvider from './ConfigProvider.vue';

export const MeConfigProvider = withInstall(ConfigProvider);

export default MeConfigProvider;

export * from './types';
export * from './config-provider';
export * from './hooks/use-config-provider';
