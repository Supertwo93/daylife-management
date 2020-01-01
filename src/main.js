import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Viewer from 'v-viewer'
import Icon from 'vue-svg-icon/Icon'

import '../node_modules/viewerjs/dist/viewer.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/element.js' 

Vue.use(Viewer, {
  defaultOptions: {
      button: true,
      navbar: false,
      title: false,
      toolbar: true,
  }
})


Vue.component("icon",Icon)

import axios from 'axios'
// 配置请求的跟路径
// axios.defaults.baseURL = 'http://192.168.3.253:9090'
axios.defaults.baseURL = 'http://sgz.wdttsh.com'
axios.interceptors.request.use(config => {
  config.headers.token = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios


Vue.config.productionTip = false 



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
