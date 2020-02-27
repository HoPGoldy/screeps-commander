<style lang="stylus" scoped>
.input-box
    background-color white
</style>

<template lang="pug">
v-app
    //- 顶部导航栏
    div
        v-app-bar(color='blue accent-3' dark app)
            v-app-bar-nav-icon(@click.stop="showSideDrawer = !showSideDrawer")
            v-toolbar-title Screeps Commander

    //- 配置菜单
    v-navigation-drawer(v-model="showSideDrawer" app temporary)
        v-list-item
            v-list-item-content
                v-list-item-title.title
                    | Screeps Commander
                v-list-item-subtitle
                    | @hopgoldy
        v-divider
        v-list(dense nav)
            v-list-item(v-for='item in items' :key='item.title' link)
                v-list-item-icon
                    v-icon {{ item.icon }}
                v-list-item-content
                    v-list-item-title {{ item.title }}

    //- 正文区域
    v-content(app)
        keep-alive
            router-view
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
    // 左侧抽屉显示项目
    items = [
        { title: '更新 token', icon: 'mdi-alpha-t-box' },
        { title: '设置 shard', icon: 'mdi-alpha-t-box' },
        { title: '导出配置项', icon: 'mdi-download-multiple' },
        { title: '导入配置项', icon: 'mdi-upload-multiple' },
        { title: '关于', icon: 'mdi-help-box' }
    ]

    // 是否展示左侧抽屉
    showSideDrawer = false
}
</script>
