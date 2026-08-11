import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Icon from './Icon.vue';

import './icon.less';

export const MeIcon = withInstall(Icon);

export default MeIcon;

export * from './icon';
