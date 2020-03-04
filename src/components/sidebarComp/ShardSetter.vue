<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-title.title.font-weight-regular.justify-space-between.pb-1
        span 设置默认 shard
    v-card-text.pt-0
        v-text-field(v-model="shard" label='shard 名称' hide-details)
        .mt-5.caption.grey--text.text--darken-1
            | 用于确定本应用控制台命令发送到的 shard（默认为 shard3）
    v-divider
    //- 下方前进后退按钮
    v-card-actions
        v-btn(depressed @click="cancel") 取消
        v-spacer
        v-btn(color='primary' depressed @click="confirm") 确认
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import Storage from '@/plugins/storage'
import { DEFAULT_SHARD_NAME } from '@/config'

@Component
export default class ShardSetter extends Vue {
    // 登陆用户名及密码
    shard = ''

    /**
     * 保存 shard
     *
     * @danger 注意，这里并没有对 shard 做校验，可能会出现问题
     */
    confirm() {
        if (this.shard === '') this.shard = DEFAULT_SHARD_NAME

        Storage.setShard(this.shard)

        this.finish()
    }

    @Emit('on-finish')
    finish(): SidebarEmitEvent {
        return {
            show: true,
            content: `已将控制台输出重定向到 ${this.shard}`,
            color: 'success'
        }
    }

    @Emit('on-finish')
    cancel(): SidebarEmitEvent {
        return {
            show: false
        }
    }

    mounted() {
        this.shard = Storage.get().shard
    }
}
</script>
