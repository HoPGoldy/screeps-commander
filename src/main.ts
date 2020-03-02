import Vue from 'vue'
import './plugins/axios.ts'
import App from './views/App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
