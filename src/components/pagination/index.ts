import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Pagination from './Pagination.vue';

import './pagination.less';

export const MePagination = withInstall(Pagination);

export default MePagination;

export * from './pagination';
export * from './constants';
