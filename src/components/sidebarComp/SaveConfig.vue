<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-text.text-center
        .subtitle-1.pt-5 该配置项可能会包含您的 token，请不要分享给其他人。
        v-text-field.mb-4(v-model="copyContent" hide-details)
        v-btn(block color="primary" dark
            v-clipboard:copy="copyContent"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
        ) 导出配置项
</template>

<script lang="ts">
import Storage from '@/plugins/storage'
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component
export default class SaveConfig extends Vue {
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
            content: '异常，可能已经导出完成，请粘贴确认',
            color: 'error'
        }
    }

    mounted() {
        this.copyContent = Storage.getOrigin()
    }
}
</script>
