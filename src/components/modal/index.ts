import '@me-ui/setup';

import { withInstall } from '@me-ui/utils/install';

import Modal from './Modal.vue';

import type { ModalFuncWithTypes } from './modal';

import { modalFunc } from './use-modal';

import './modal.less';

export const MeModal = withInstall(Modal) as ReturnType<typeof withInstall<typeof Modal>> & ModalFuncWithTypes;

// 挂载函数式调用方法
MeModal.info = modalFunc.info;
MeModal.success = modalFunc.success;
MeModal.warning = modalFunc.warning;
MeModal.error = modalFunc.error;
MeModal.confirm = modalFunc.confirm;

export default MeModal;

export * from './modal';
