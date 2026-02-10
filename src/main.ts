import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './style.css';
import './style/element-plus.scss';
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import store from './store/index';

const app = createApp(App);

// 全局指令：数字颜色
app.directive('number-color', {
  mounted(el: HTMLElement) {
    const value = el.innerText;
    // 是否是百分比
    const isPercent = value.indexOf('%') !== -1;
    const count = Number(value.replace(/[^\d.-]/g, ''));
    el.style.color = count > 0 ? 'red' : 'green';
    el.innerText = count > 0 ? '+' + count.toFixed(2) : count.toFixed(2);
    if (isPercent) el.innerText += '%';
  },
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(store);
app.use(ElementPlus);
app.mount('#app');
