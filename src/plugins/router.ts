import Vue from 'vue'
import VueRouter from 'vue-router'

import Command from '../components/Command.vue'
import Console from '../components/Console.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/command' },
    { path: '/command', component: Command },
    { path: '/console', component: Console }
]

export default new VueRouter({
    routes
})
