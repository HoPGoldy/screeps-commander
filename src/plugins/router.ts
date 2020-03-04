import Vue from 'vue'
import VueRouter from 'vue-router'

import Console from '../components/Console.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/console' },
    { path: '/console', component: Console }
]

export default new VueRouter({
    routes
})
