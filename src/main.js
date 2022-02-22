import Vue from 'vue'
import App from './App.vue'
import router from './router';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import api from './api/api'
import Plugin from 'v-fit-columns';

Vue.use(Plugin);

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.prototype.$api=api

new Vue({
  render: h => h(App),
  router:router,
  store,
  beforeCreate() {
    Vue.prototype.$bus=this
  },
}).$mount('#app')
