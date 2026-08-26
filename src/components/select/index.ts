import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Select from './Select.vue';
import SelectDropdown from './SelectDropdown.vue';
import Option from './Option.vue';

import './select.less';

export const MeSelect = withInstall(Select);
export const MeSelectDropdown = withInstall(SelectDropdown);
export const MeOption = withInstall(Option);

export default MeSelect;

export * from './select';
