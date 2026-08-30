import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Select from './Select.vue';

import './select.less';

export const MeSelect = withInstall(Select);

export default MeSelect;

export * from './select';
export * from './types';
