<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-text.text-center
        .subtitle-1.py-5 点击下方按钮将导出配置项到剪切板。
        v-btn(block color="primary" dark
            v-clipboard:copy="copyContent"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
        ) 导出配置项
</template>

<script lang="ts">
import StorageApi from '@/plugins/storageApi'
import { Component, Mixins, Emit } from 'vue-property-decorator'

@Component
export default class SaveConfig extends Mixins(StorageApi) {
    // 要复制的数据字符串
    copyContent = ''

    @Emit('on-finish')
    onCopy(): SidebarEmitEvent {
        return {
            show: true,
            content: '已导出到剪切板',
            color: 'success'
        }
    }

    @Emit('on-finish')
    onError(): SidebarEmitEvent {
        return {
            show: true,
            content: '导出失败，请检查所用的浏览器是否为最新版本',
            color: 'error'
        }
    }

    mounted() {
        this.copyContent = this.getOriginStorage()
    }
}
</script>
