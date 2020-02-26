<style lang="stylus" scoped>
.v-btn--fab.v-btn--fixed
    z-index 6
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

    //- 正文区域
    v-content
        v-fab-transition
            v-btn.fab-btn(v-show="activeTab === 'command'" color='pink' transition="scroll-y-transition" dark fixed bottom right fab)
                v-icon mdi-plus
        v-fab-transition
            v-btn.fab-btn(v-show="activeTab === 'console'" @click="showInputBox = !showInputBox" color='pink' transition="scroll-y-transition" dark fixed bottom right fab)
                v-icon mdi-code-braces
        keep-alive
            router-view

    //- 底部导航栏
    v-bottom-navigation(v-model="activeTab" color="indigo" shift app)
        v-btn(v-for="item in navBtns" :value="item.value")
            span {{item.label}}
            v-icon {{item.icon}}

    //- 底部弹出的命令输入框
    v-bottom-sheet(v-model='showInputBox')
        v-text-field.pa-2(v-model="inputCommand" outlined label="键入命令" append-icon="mdi-chevron-double-right" @click:append="sendCommand" solo hide-details clearable)
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

    // 是否显示 console 的底部输入框
    showInputBox = false

    // 用户手动输入的命令
    inputCommand = ''

    get activeTab(): string {
        return this.tab
    }

    set activeTab(newData: string) {
        this.$router.push(newData)
        this.tab = newData
    }

    sendCommand() {
        console.log(this.inputCommand)
        this.showInputBox = !this.showInputBox
    }
}
</script>
