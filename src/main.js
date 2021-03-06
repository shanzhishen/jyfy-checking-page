import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "babel-polyfill"


Vue.config.productionTip = false
import '@/assets/css/main.scss';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
