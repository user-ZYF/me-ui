import type { App } from 'vue';

import { MeButton } from './components/button';
import { MeCheckbox, MeCheckboxGroup } from './components/checkbox';
import { MeConfigProvider } from './components/config-provider';
import { MeForm, MeFormItem } from './components/form';
import { MeIcon } from './components/icon';
import { MeInput } from './components/input';
import { MeModal } from './components/modal';
import { MePagination } from './components/pagination';
import { MeRadio, MeRadioButton, MeRadioGroup } from './components/radio';
import { MeSelect } from './components/select';
import { MeScrollbar } from './components/scrollbar';
import { MeTable, MeTableColumn } from './components/table';
import { MeTag } from './components/tag';
import { MeTooltip } from './components/tooltip';
import { MeVirtualList } from './components/virtual-list';

import './setup';

const components = [MeButton, MeCheckbox, MeCheckboxGroup, MeConfigProvider, MeForm, MeFormItem, MeIcon, MeInput, MeModal, MePagination, MeRadio, MeRadioButton, MeRadioGroup, MeSelect, MeScrollbar, MeTable, MeTableColumn, MeTag, MeTooltip, MeVirtualList];

/**
 * Vue 插件安装入口
 * @param app Vue 应用实例
 */
function install(app: App) {
  components.forEach((component) => {
    app.use(component as unknown as { install: (app: App) => void });
  });
}

export { MeButton, MeCheckbox, MeConfigProvider, MeForm, MeFormItem, MeIcon, MeInput, MeModal, MePagination, MeRadio, MeRadioButton, MeRadioGroup, MeSelect, MeScrollbar, MeTable, MeTableColumn, MeTag, MeTooltip, MeVirtualList };

export default { install };
