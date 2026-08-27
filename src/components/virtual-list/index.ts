import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import VirtualList from './VirtualList.vue';

import './virtual-list.less';

export const MeVirtualList = withInstall(VirtualList);

export default MeVirtualList;

export * from './virtual-list';
export * from './types';
