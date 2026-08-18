import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Tag from './Tag.vue';

import './tag.less';

export const MeTag = withInstall(Tag);

export default MeTag;

export * from './tag';
