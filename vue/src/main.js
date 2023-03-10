import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import * as VueGoogleMaps from 'vue2-google-maps'
// Make BootstrapVue available throughout your project
// Vue.use(BootstrapVue),
// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin),
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAfpmZoqcNF2wvl3Bv1NhiLDa0kRBTnuj4',
    libraries: 'places'}
});

Vue.config.productionTip = false

axios.defaults.baseURL = process.env.VUE_APP_REMOTE_API;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')





