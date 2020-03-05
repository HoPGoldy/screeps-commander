<style lang="stylus" scoped>
.message-content
    overflow-x scroll
</style>

<template lang="pug">
.console-item-contaienr
    v-list-item
        v-list-item-icon.my-3.mr-4
            v-btn(icon small :loading="loading")
                v-icon(:color="iconColor") {{icon}}
        v-list-item-content
            .message-content.body-2(ref="content")
                .my-2(v-for="_ in content")
    v-divider
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

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

    @Prop({
        default: true
    })
    loading!: boolean

    get iconColor() {
        if (this.icon === 'mdi-arrow-bottom-right-thick') return 'amber'
        else if (this.icon === 'mdi-arrow-top-left-thick') return 'light-blue'
        else return 'light-green'
    }

    @Watch('content')
    refrashContent(newData: string[]) {
        // 获取父容器
        const contentBox = this.$refs.content as HTMLElement

        // 将内容依次填入到对应的 div 中
        for (let i = 0; i < contentBox.children.length; i++) {
            contentBox.children[i].innerHTML = newData[i]
        }
    }

    mounted() {
        this.refrashContent(this.content)
    }
}
</script>
