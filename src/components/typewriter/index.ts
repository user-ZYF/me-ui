import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Typewriter from './Typewriter.vue';

import './typewriter.less';

export const MeTypewriter = withInstall(Typewriter);

export default MeTypewriter;

export * from './typewriter';
