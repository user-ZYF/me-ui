import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Form from './Form.vue';
import FormItem from './FormItem.vue';

import '@me-ui/styles/transitions.less';

import './form.less';

export const MeForm = withInstall(Form);
export const MeFormItem = withInstall(FormItem);

export default MeForm;

export * from './form';
export * from './form-item';
export * from './types';
export * from './constants';
export * from './hooks';
