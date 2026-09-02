import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Table from './Table.vue';
import TableColumn from './TableColumn.vue';

import './table.less';

export const MeTable = withInstall(Table);
export const MeTableColumn = withInstall(TableColumn);

export default MeTable;

export * from './types';
export * from './table';
export * from './table-column';
