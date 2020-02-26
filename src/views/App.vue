<style lang="stylus" scoped>
.input-box
    background-color white
</style>

<template lang="pug">
v-app
    //- 顶部导航栏
    div
        v-app-bar(color='blue accent-3' dark app)
            v-app-bar-nav-icon(@click.stop="drawer = !drawer")
            v-toolbar-title Screeps Commander

    //- 配置菜单
    v-navigation-drawer(v-model="drawer" app temporary)
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

    //- 底部导航栏
    v-bottom-navigation(v-model="activeTab" color="indigo" shift app)
        v-btn(v-for="item, index in navBtns" :value="item.value" :key="index")
            span {{item.label}}
            v-icon {{item.icon}}

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
    // 左侧抽屉是否显示
    drawer = false

    // 当前显示的标签页
    tab = 'command'

    // 左侧抽屉显示项目
    items = [
        { title: '更新 token', icon: 'mdi-alpha-t-box' },
        { title: '导出配置项', icon: 'mdi-download-multiple' },
        { title: '导入配置项', icon: 'mdi-upload-multiple' },
        { title: '关于', icon: 'mdi-help-box' }
    ]

    // 底部导航栏的配置项
    navBtns = [
        {
            label: '命令',
            icon: 'mdi-apple-keyboard-command',
            value: 'command'
        },
        {
            label: '控制台',
            icon: 'mdi-greater-than-or-equal',
            value: 'console'
        }
    ]

    get activeTab(): string {
        return this.tab
    }

    set activeTab(newData: string) {
        this.$router.push(newData)
        this.tab = newData
    }
}
</script>
