<template lang="pug">
v-card
    v-card-text.pa-2
        v-list-item
            v-list-item-content
                v-list-item-title 作者
                .pt-1
                    span 本应用由
                    a(@click="openPage(homePage)")  HoPGoldy
                    span  制作并开源。
        v-list-item
            v-list-item-content
                v-list-item-title 数据
                .pt-1 本应用所有数据均保存在本地，自动或手动清除浏览器缓存将可能导致数据丢失（确保浏览器已退出无痕模式），请妥善使用导出 / 导入功能。
        v-list-item
            v-list-item-content
                v-list-item-title 隐私
                .pt-1 本应用不会保存您的 Screeps 账号密码，所以在退出应用后您可能需要重新登录。
        v-list-item
            v-list-item-content
                v-list-item-title 开源
                .pt-1
                    span 本应用代码已开源至 github。点击
                    a(@click="openPage(githubUrl)")  此处
                    span  来访问本项目源码。
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class About extends Vue {
    // 项目开源地址
    githubUrl = 'https://github.com/HoPGoldy/screeps-commander'

    // 个人主页地址
    homePage = 'https://hopgoldy.github.io/'

    // 打开指定新页面
    openPage(url: string) {
        window.open(url)
    }
}
</script>
