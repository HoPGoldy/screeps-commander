<style lang="stylus" scoped>
.input-box
    background-color white
</style>

<template lang="pug">
v-app
    //- 顶部导航栏
    div
        v-app-bar(color='blue accent-3' dark app)
            v-app-bar-nav-icon(@click.stop="sideDrawerVisiable = !sideDrawerVisiable")
            v-toolbar-title Screeps Commander

    //- 左侧导航条
    navigation(:show="sideDrawerVisiable" @on-close="sideDrawerVisiable = false")

    //- 正文区域
    v-content(app)
        router-view
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import Navigation from '@/components/Navigation.vue'

@Component({
    components: { Navigation }
})
export default class App extends Vue {
    // 是否展示侧边栏
    sideDrawerVisiable = false
}
</script>
