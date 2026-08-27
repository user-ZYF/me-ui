import { createApp } from 'vue';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import MeUI from '../src/index.ts';

import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.use(Antd);
app.use(MeUI);

app.mount('#app');
