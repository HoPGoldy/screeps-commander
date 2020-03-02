<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-text.py-5.text-center
        .subtitle-1 {{introduce}}
        v-text-field(v-model="newConfig" label='粘贴至此处' hide-details clearable)
    v-card-actions
        v-btn(v-if="statsConfirm" @click="cancelLoad") 取消
        v-spacer(v-if="statsConfirm")
        v-btn(:block="!statsConfirm" :color="btnColor" dark @click="confirmLoad") {{btnText}}
</template>

<script lang="ts">
import StorageApi from '@/plugins/storageApi'
import { Component, Mixins, Emit } from 'vue-property-decorator'

@Component
export default class LoadConfig extends Mixins(StorageApi) {
    // 用户输入的新配置项
    newConfig = ''

    statsConfirm = false

    // 介绍内容
    get introduce() {
        return this.statsConfirm ? '接下来的操作会覆盖你的现存配置项，是否继续？'
            : '将加密后的配置项粘贴到下方并点击”应用“按钮来导入配置项。'
    }

    // 导入按钮的显示文本
    get btnText() {
        return this.statsConfirm ? '我了解，确认' : '应用'
    }

    // 导入按钮的显示颜色
    get btnColor() {
        return this.statsConfirm ? 'error' : 'primary'
    }

    // 导入确认
    confirmLoad(): void {
        if (this.newConfig === '') return

        if (this.statsConfirm) this.loadConfig()
        else this.statsConfirm = true
    }

    // 取消确认
    cancelLoad(): void {
        this.statsConfirm = false
    }

    // 导入配置项并重设状态
    loadConfig() {
        this.statsConfirm = false
        this.newConfig = ''
        this.saveOriginStorage(this.newConfig)

        this.finish()
    }

    @Emit('on-finish')
    finish() { }
}
</script>
