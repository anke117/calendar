import Vue from 'vue'
import App from './app'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
new Vue({
  el : '#app',
  render: h => h(App),
  template : '<App/>',
  components : {
    App
  }
});