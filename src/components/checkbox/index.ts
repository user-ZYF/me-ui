import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Checkbox from './Checkbox.vue';
import CheckboxGroup from './CheckboxGroup.vue';

import './checkbox.less';
import './checkbox-group.less';

export const MeCheckbox = withInstall(Checkbox);
export const MeCheckboxGroup = withInstall(CheckboxGroup);

export default MeCheckbox;

export * from './checkbox';
export * from './checkbox-group';
