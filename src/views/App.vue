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

    Boot(:show="showBoot" @on-finish="onBootFinish")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StorageApi from '../plugins/storageApi'
import { LOCAL_STORAGE_NAME } from '../config'

import Boot from '../components/Boot.vue'

@Component({
    components: { Boot }
})
export default class App extends Mixins(StorageApi) {
    // 左侧抽屉显示项目
    items = [
        { title: '更新身份信息', icon: 'mdi-alpha-t-box' },
        { title: '设置 shard', icon: 'mdi-alpha-t-box' },
        { title: '导出配置项', icon: 'mdi-download-multiple' },
        { title: '导入配置项', icon: 'mdi-upload-multiple' },
        { title: '关于', icon: 'mdi-help-box' }
    ]

    // 是否展示左侧抽屉
    showSideDrawer = false

    // 是否展示初始化引导
    showBoot = false

    /**
     * 回调 - 完成初始化工作
     */
    onBootFinish(info: PlayerLoginData) {
        // console.log('引导完成了！', info)
        this.showBoot = false
    }

    mounted() {
        // 如果本地没有数据存储的话就启动初始化引导
        if (!localStorage[LOCAL_STORAGE_NAME]) this.showBoot = true
    }
}
</script>
