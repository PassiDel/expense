// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import enums from 'vue-enums'
import VueGraph from 'vue-graph'
import App from './App'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/js/bootstrap'
import 'bootswatch/dist/darkly/bootstrap.min.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueGraph)

Vue.use(enums, {namespace: '$enums'})

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.filter('currency', function (value) {
  if (typeof value !== 'number') {
    try {
      value = parseFloat(value)
    } catch (e) {
      return value
    }
  }

  return `${value.toFixed(2)} €`
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
