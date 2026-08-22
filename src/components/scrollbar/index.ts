import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Scrollbar from './Scrollbar.vue';

import './scrollbar.less';

export const MeScrollbar = withInstall(Scrollbar);

export default MeScrollbar;

export * from './scrollbar';
