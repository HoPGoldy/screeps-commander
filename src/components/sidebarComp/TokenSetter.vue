<template lang="pug">
v-card
    v-card-text.py-5.text-center
        .subtitle-1 {{introduce}}
        v-text-field(v-model="newToken" label='粘贴至此处' hide-details clearable)
    v-card-actions
        v-btn(v-if="statsConfirm" @click="cancelLoad") 取消
        v-spacer(v-if="statsConfirm")
        v-btn(:block="!statsConfirm" :color="btnColor" dark @click="confirmImport") {{btnText}}
</template>

<script lang="ts">
/**
 * 侧边栏设置 token 弹出框
 */
import Storage from '@/plugins/storage'
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class TokenSetter extends Vue {
    // 用户输入的新 token
    newToken = ''

    // 组件的显示状态
    // 该值为 true 时组件将自动切换到确认是否导入的显示效果
    statsConfirm = false

    // 介绍内容
    get introduce() {
        return this.statsConfirm ? '接下来的操作会覆盖你的现存 Token，是否继续？'
            : '将 AuthToken 粘贴至此处来更新您的配置，置空来移除 token'
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
    confirmImport(): void {
        if (this.statsConfirm) this.importToken()
        else this.statsConfirm = true
    }

    // 取消确认
    cancelLoad(): void {
        this.statsConfirm = false
    }

    // 导入配置项并重设状态
    importToken() {
        Storage.setToken(this.newToken)

        this.statsConfirm = false

        this.finish()
        this.newToken = ''
    }

    @Emit('on-finish')
    finish(): SidebarEmitEvent {
        return {
            show: true,
            content: this.newToken ? '导入成功, 已启用免登陆' : '移除成功，免登陆已关闭',
            color: 'success'
        }
    }
}
</script>
