import type { App, Component } from 'vue';

/**
 * 为组件添加 install 方法，使其可通过 app.use() 注册
 * @param component Vue 组件
 * @returns 带有 install 方法的组件
 */
export function withInstall<T extends Component>(component: T) {
  const componentWithInstall = component as T & {
    install: (app: App) => void;
  };

  componentWithInstall.install = (app: App) => {
    app.component(component.name ?? '', componentWithInstall);
  };

  return componentWithInstall;
}
