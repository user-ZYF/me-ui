import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Tree from './Tree.vue';

import './tree.less';

export const MeTree = withInstall(Tree);

export default MeTree;

export * from './tree';
export * from './types';
export type { TreeEventNode as TreeNodeModel } from './types';
