import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Input from './Input.vue';

import './input.less';

export const MeInput = withInstall(Input);

export default MeInput;

export * from './input';
