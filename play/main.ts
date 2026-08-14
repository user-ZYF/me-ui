import { createApp } from 'vue';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';

import MeUI from '../src/index.ts';

import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus);
app.use(MeUI);

app.mount('#app');
