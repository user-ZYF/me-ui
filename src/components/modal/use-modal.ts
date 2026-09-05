import { defineComponent, h, ref, render } from 'vue';
import type { Component } from 'vue';

import { CircleCheckFilled, CircleCloseFilled, InfoFilled, WarningFilled } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';
import { useNamespace } from '@me-ui/hooks/use-namespace';
import { isFunction } from '@me-ui/utils';

import Modal from './Modal.vue';
import type { ModalFuncReturn, ModalFuncWithTypes, ModalOptions, ModalType } from './modal';

/** 图标组件映射 */
const iconComponentMap: Record<Exclude<ModalType, 'confirm'>, Component> = {
  info: InfoFilled,
  success: CircleCheckFilled,
  warning: WarningFilled,
  error: CircleCloseFilled,
};

/** 各类型默认配置 */
const defaultOptionsMap: Record<ModalType, Partial<ModalOptions>> = {
  confirm: {},
  info: {
    showCancel: false,
  },
  success: {
    showCancel: false,
  },
  warning: {
    showCancel: false,
  },
  error: {
    showCancel: false,
  },
};

/**
 * 创建函数式 Modal
 * @param type Modal 类型
 * @param userOptions 用户配置
 * @returns Modal 实例
 */
function useFunctionalModal(type: ModalType, userOptions: ModalOptions): ModalFuncReturn {
  const mergedOptions: ModalOptions = {
    ...defaultOptionsMap[type],
    ...userOptions,
  };

  /** 是否可见 */
  const visible = ref(true);

  /** 确认按钮 loading */
  const confirmLoading = ref(false);

  /** 取消按钮 loading */
  const cancelLoading = ref(false);

  /** 当前配置 */
  const currentOptions = ref<ModalOptions>({ ...mergedOptions });

  /**
   * 确认处理
   */
  async function handleConfirm() {
    const opts = currentOptions.value;
    const confirmHandler = opts.confirmButtonProps?.onClick ?? opts.onConfirm;

    if (isFunction(confirmHandler)) {
      confirmLoading.value = true;
      try {
        const result = await confirmHandler();
        if (result === false) return;
      } finally {
        confirmLoading.value = false;
      }
    }

    close();
  }

  /**
   * 取消处理
   */
  async function handleCancel() {
    const opts = currentOptions.value;
    const cancelHandler = opts.cancelButtonProps?.onClick ?? opts.onCancel;
    if (isFunction(cancelHandler)) {
      cancelLoading.value = true;
      try {
        const result = await cancelHandler();
        if (result === false) return;
      } finally {
        cancelLoading.value = false;
      }
    }

    close();
  }

  /**
   * 关闭
   */
  function close() {
    visible.value = false;
  }

  /**
   * 更新配置
   */
  function update(newOptions: Partial<ModalOptions>) {
    currentOptions.value = { ...currentOptions.value, ...newOptions };
  }

  /** 容器 DOM */
  const container = document.createElement('div');
  document.body.appendChild(container);

  /** 是否已清理 */
  let isCleaned = false;

  /** 清理 DOM */
  function cleanup() {
    if (isCleaned) return;
    isCleaned = true;
    render(null, container);
    document.body.removeChild(container);
  }

  /** 函数式 Modal 组件 */
  const FuncModal = defineComponent({
    name: 'MeModalFunc',
    setup() {
      const ns = useNamespace('modal');

      return () => {
        const opts = currentOptions.value;
        const hasTypeIcon = type !== 'confirm';
        const iconComp = opts.icon ?? (hasTypeIcon ? iconComponentMap[type] : undefined);
        const iconNode = iconComp ? h(MeIcon, { size: 22 }, () => h(iconComp)) : undefined;

        return h(Modal, {
          open: visible.value,
          'onUpdate:open': (val: boolean) => {
            visible.value = val;
          },
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onAfterLeave: cleanup,
          title: opts.title ?? '',
          width: opts.width ?? 420,
          mask: opts.mask,
          maskClosable: opts.maskClosable,
          closable: opts.closable,
          confirmText: opts.confirmButtonProps?.text ?? opts.confirmText,
          cancelText: opts.cancelButtonProps?.text ?? opts.cancelText,
          confirmType: opts.confirmButtonProps?.type ?? opts.confirmType,
          showCancel: opts.showCancel,
          confirmLoading: confirmLoading.value || opts.confirmButtonProps?.loading || opts.confirmLoading || false,
          cancelLoading: cancelLoading.value || opts.cancelButtonProps?.loading || opts.cancelLoading || false,
          confirmButtonDisabled: opts.confirmButtonProps?.disabled || opts.confirmButtonDisabled || false,
          cancelButtonDisabled: opts.cancelButtonProps?.disabled || opts.cancelButtonDisabled || false,
          zIndex: opts.zIndex,
          wrapClassName: opts.wrapClassName,
          footer: opts.footer,
        }, {
          default: () => opts.content,
          ...(iconNode ? {
            title: () => h('span', { class: ns.e('title') }, [
              h('span', { class: [ns.e('func-icon'), ns.is(type, hasTypeIcon)] }, [iconNode]),
              opts.title ?? '',
            ]),
          } : {}),
        });
      };
    },
  });

  render(h(FuncModal), container);

  return {
    close,
    update,
  };
}

/** 函数式 Modal */
const modalFunc: ModalFuncWithTypes = {
  info: (options: ModalOptions) => useFunctionalModal('info', options),
  success: (options: ModalOptions) => useFunctionalModal('success', options),
  warning: (options: ModalOptions) => useFunctionalModal('warning', options),
  error: (options: ModalOptions) => useFunctionalModal('error', options),
  confirm: (options: ModalOptions) => useFunctionalModal('confirm', options),
};

export { modalFunc };
