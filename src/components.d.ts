import type { MeButton } from './components/button';
import type { MeCheckbox, MeCheckboxGroup } from './components/checkbox';
import type { MeConfigProvider } from './components/config-provider';
import type { MeForm, MeFormItem } from './components/form';
import type { MeIcon } from './components/icon';
import type { MeInput } from './components/input';
import type { MeModal } from './components/modal';
import type { MePagination } from './components/pagination';
import type { MeRadio, MeRadioButton, MeRadioGroup } from './components/radio';
import type { MeSelect } from './components/select';
import type { MeScrollbar } from './components/scrollbar';
import type { MeTable, MeTableColumn } from './components/table';
import type { MeTag } from './components/tag';
import type { MeTooltip } from './components/tooltip';
import type { MeTree } from './components/tree';
import type { MeTypewriter } from './components/typewriter';
import type { MeVirtualList } from './components/virtual-list';

declare module 'vue' {
  export interface GlobalComponents {
    MeButton: typeof MeButton;
    MeCheckbox: typeof MeCheckbox;
    MeCheckboxGroup: typeof MeCheckboxGroup;
    MeConfigProvider: typeof MeConfigProvider;
    MeForm: typeof MeForm;
    MeFormItem: typeof MeFormItem;
    MeIcon: typeof MeIcon;
    MeInput: typeof MeInput;
    MeModal: typeof MeModal;
    MePagination: typeof MePagination;
    MeRadio: typeof MeRadio;
    MeRadioButton: typeof MeRadioButton;
    MeRadioGroup: typeof MeRadioGroup;
    MeSelect: typeof MeSelect;
    MeScrollbar: typeof MeScrollbar;
    MeTable: typeof MeTable;
    MeTableColumn: typeof MeTableColumn;
    MeTag: typeof MeTag;
    MeTooltip: typeof MeTooltip;
    MeTree: typeof MeTree;
    MeTypewriter: typeof MeTypewriter;
    MeVirtualList: typeof MeVirtualList;
  }
}

export {};
