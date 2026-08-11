import type { App } from 'vue';

import { MeButton } from './components/button';
import { MeConfigProvider } from './components/config-provider';
import { MeIcon } from './components/icon';
import { MeInput } from './components/input';

import './setup';

const components = [MeButton, MeConfigProvider, MeIcon, MeInput];

/**
 * Vue 插件安装入口
 * @param app Vue 应用实例
 */
function install(app: App) {
  components.forEach((component) => {
    app.use(component as unknown as { install: (app: App) => void });
  });
}

export { MeButton, MeConfigProvider, MeIcon, MeInput };

export default { install };
