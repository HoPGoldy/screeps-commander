import Vue from 'vue'
import './plugins/axios.ts'
import App from './views/App.vue'
import router from './plugins/router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
