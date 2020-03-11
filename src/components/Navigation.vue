<style lang="stylus" scoped>

</style>

<template lang="pug">
.nav-container
    //- 配置菜单
    v-navigation-drawer(v-model="sidebarDrawerVisiable" app temporary )
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

    //- 左侧列表按钮的弹出框
    v-dialog(v-model='sidebarVisiable' eager :persistent="sidebarPersistent")
        component(:is="activeSidebar" @on-finish="onSidebarFinish")
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'
import SidebarComp from './sidebarComp'

@Component({
    components: { ...SidebarComp }
})
export default class Navigation extends Vue {
    // 左侧抽屉显示项目
    items = [
        { title: '创建新按钮', comp: 'button-edit', icon: 'mdi-plus-box-multiple', persistent: true },
        { title: '配置按钮', comp: 'button-config', icon: 'mdi-cursor-default-click', persistent: false },
        { title: '设置 shard', comp: 'shard-setter', icon: 'mdi-server', persistent: false },
        { title: '管理 AuthToken', comp: 'token-setter', icon: 'mdi-alpha-t-box', persistent: false },
        { title: '导出配置项', comp: 'save-config', icon: 'mdi-download-multiple', persistent: false },
        { title: '导入配置项', comp: 'load-config', icon: 'mdi-upload-multiple', persistent: false },
        { title: '关于', comp: 'about', icon: 'mdi-help-box', persistent: false }
    ]

    // 是否展示该导航抽屉
    @Prop({
        required: true
    })
    show = false

    // 将 prop 同步到本组件中
    @Watch('show')
    syncShow(show: boolean) {
        this.sidebarDrawerVisiable = show
    }

    // 如果抽屉主动关闭了，就通知父级组件
    @Watch('sidebarDrawerVisiable')
    emitCloseEvent(newData: boolean) {
        if (!newData) this.closeDrawer()
    }

    // 是否展示侧边栏 dialog
    sidebarVisiable = false
    // 是否展示本导航抽屉
    sidebarDrawerVisiable = false
    // 侧边栏 dialog 是否禁止“点击外围区域时返回”
    sidebarPersistent = false

    // 当前要展示的侧边栏组件名称
    activeSidebar = 'save-config'

    /**
     * 回调 - 侧边栏按钮被点击
     *
     * @param compName 要显示的组件名
     * @param persistent 是否禁用“点击外围区域返回”
     */
    onClickSidebar(compName: string, persistent: boolean) {
        this.sidebarVisiable = true
        this.sidebarDrawerVisiable = false
        this.activeSidebar = compName
        this.sidebarPersistent = persistent
    }

    /**
     * 回调 - 侧边栏工作完成
     */
    onSidebarFinish(e: SidebarEmitEvent) {
        this.sidebarVisiable = false

        if (!e.show) return

        // this.message(e.color || 'success', e.content || '设置成功')
        this.$toast(e.content || '设置成功', {
            color: e.color
        })
    }

    // 发射事件 - 请求关闭抽屉
    @Emit('on-close')
    closeDrawer() { }
}
</script>
