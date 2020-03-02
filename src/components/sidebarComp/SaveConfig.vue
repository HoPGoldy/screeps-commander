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
    onCopy() {
        return '复制成功'
    }

    @Emit('on-finish')
    onError() {
        return '复制失败'
    }

    mounted() {
        this.copyContent = this.getOriginStorage()
    }
}
</script>
