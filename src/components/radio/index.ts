import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Radio from './Radio.vue';
import RadioButton from './RadioButton.vue';
import RadioGroup from './RadioGroup.vue';

import './radio.less';
import './radio-button.less';
import './radio-group.less';

export const MeRadio = withInstall(Radio);
export const MeRadioButton = withInstall(RadioButton);
export const MeRadioGroup = withInstall(RadioGroup);

export default MeRadio;

export * from './radio';
export * from './radio-button';
export * from './radio-group';
export * from './useRadio';
