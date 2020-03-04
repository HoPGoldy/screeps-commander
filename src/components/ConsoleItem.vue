<style lang="stylus" scoped>
.message-content
    overflow-x scroll
</style>

<template lang="pug">
.console-item-contaienr
    v-list-item
        v-list-item-icon.my-3.mr-4
            v-icon {{icon}}
        v-list-item-content
            .message-content.body-2(ref="content")
                .my-2(v-for="_ in content")
    v-divider
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class ConsoleItem extends Vue {
    @Prop({
        required: true
    })
    content!: string[]

    @Prop({
        required: true
    })
    icon!: string

    mounted() {
        // 获取父容器
        const contentBox = this.$refs.content as HTMLElement

        // 将内容依次填入到对应的 div 中
        for (let i = 0; i < contentBox.children.length; i++) {
            contentBox.children[i].innerHTML = this.content[i]
        }
    }
}
</script>
