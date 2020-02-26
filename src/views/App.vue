<style lang="stylus" scoped>

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
        v-tabs-items(v-model='activeTab')
            v-tab-item(key="命令")
                Command
            v-tab-item(key="控制台")
                Console

    //- 底部导航栏
    v-footer(padless app)
        v-tabs(v-model='activeTab' background-color='blue accent-3' dark centered grow)
            v-tab
                v-icon.mr-3 mdi-apple-keyboard-command
                | 命令
            v-tab
                v-icon.mr-3 mdi-greater-than-or-equal
                | 控制台

</template>

<script lang="ts">
import Vue from 'vue'
import Command from '../components/Command.vue'
import Console from '../components/Console.vue'

export default Vue.extend({
    name: 'App',
    components: { Command, Console },

    data: () => ({
        drawer: null,
        activeTab: null,
        items: [
            { title: '更新 token', icon: 'mdi-alpha-t-box' },
            { title: '导出配置项', icon: 'mdi-download-multiple' },
            { title: '导入配置项', icon: 'mdi-upload-multiple' },
            { title: '关于', icon: 'mdi-help-box' }
        ],
        right: null
    }),

    watch: {
        bottomNav: function(newData) {
            console.log('TCL: newData', newData)
            this.$router.push(newData)
        }
    }
})
</script>
