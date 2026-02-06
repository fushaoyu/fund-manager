import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
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
    if (isPercent) {
      el.innerText += '%';
    }
  },
});
app.use(store);
app.use(ElementPlus);
app.mount('#app');
