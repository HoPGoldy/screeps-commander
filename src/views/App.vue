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
            v-list-item(v-for='item in items' :key='item.title' link @click="onClickSidebar(item.comp, item.persistent)")
                v-list-item-icon
                    v-icon {{ item.icon }}
                v-list-item-content
                    v-list-item-title {{ item.title }}

    //- 正文区域
    v-content(app)
        router-view

    //- 左侧列表按钮的弹出框
    v-dialog(v-model='showSidebar' eager :persistent="sidebarPersistent")
        component(:is="activeSidebar" @on-finish="onSidebarFinish")

    Boot(:show="showBoot" @on-finish="onBootFinish")

    //- 消息弹窗
    v-snackbar(v-model="showMessage" :color="messageColor") {{messageText}}
        v-btn(text @click="showMessage = false") 关闭
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StorageApi from '../plugins/storageApi'
import { LOCAL_STORAGE_NAME } from '../config'

import Boot from '../components/Boot.vue'
import SidebarComp from '../components/sidebarComp'

@Component({
    components: { Boot, ...SidebarComp }
})
export default class App extends Mixins(StorageApi) {
    // 左侧抽屉显示项目
    items = [
        { title: '创建新按钮', comp: 'add-new-button', icon: 'mdi-plus-box-multiple', persistent: true },
        { title: '设置 shard', comp: 'shard-setter', icon: 'mdi-server', persistent: false },
        { title: '导出配置项', comp: 'save-config', icon: 'mdi-download-multiple', persistent: false },
        { title: '导入配置项', comp: 'load-config', icon: 'mdi-upload-multiple', persistent: false },
        { title: '关于', comp: 'about', icon: 'mdi-help-box', persistent: false }
    ]

    // 是否展示左侧抽屉
    showSideDrawer = false
    // 是否展示侧边栏 dialog
    showSidebar = false
    // 侧边栏 dialog 是否禁止“点击外围区域时返回”
    sidebarPersistent = false

    // 当前要展示的侧边栏组件名称
    activeSidebar = 'save-config'

    // 是否展示初始化引导
    showBoot = false

    // 弹出框的基本信息
    showMessage = false
    messageColor = 'success'
    messageText = ''

    /**
     * 回调 - 完成初始化工作
     */
    onBootFinish() {
        this.showBoot = false
    }

    /**
     * 回调 - 侧边栏按钮被点击
     *
     * @param compName 要显示的组件名
     * @param persistent 是否禁用“点击外围区域返回”
     */
    onClickSidebar(compName: string, persistent: boolean) {
        this.showSidebar = true
        this.showSideDrawer = false
        this.activeSidebar = compName
        this.sidebarPersistent = persistent
    }

    /**
     * 回调 - 侧边栏工作完成
     */
    onSidebarFinish(e: SidebarEmitEvent) {
        this.showSidebar = false

        if (!e.show) return

        this.message(e.color || 'success', e.content || '设置成功')
    }

    // 消息弹窗的封装
    message(color: string, text: string) {
        this.messageColor = color
        this.messageText = text
        this.showMessage = true
    }

    mounted() {
        // 如果本地没有数据存储的话就启动初始化引导
        if (!localStorage[LOCAL_STORAGE_NAME]) this.showBoot = true
    }
}
</script>
