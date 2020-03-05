<template lang="pug">
.console-item-contaienr
    v-list-item(:ripple="false")
        v-list-item-icon.my-3.mr-4
            v-btn(icon small :loading="loading" @click="copyContent")
                v-icon(:color="iconColor") {{icon}}
        v-list-item-content
            .body-2(ref="content")
                .my-2(v-for="_ in content")
    v-divider
</template>

<script lang="ts">
/**
 * 控制台信息组件
 *
 * 这里有个问题，因为如下原因导致了不能动态调整显示内容的行数：
 * - 动态调整显示行数需要在内容发生变化时动态增减 div
 * - div 的动态增减是异步的，但是没有找到回调方法
 * - 上面两条导致数据的赋值在 div 创建之前，就引发了不显示内容的问题
 */
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

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
        else if (this.icon === 'mdi-alert-circle') return 'error'
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

    // 当图标被点击时会返回该行的数据
    @Emit('on-icon-click')
    copyContent(): string[] {
        return this.content
    }

    mounted() {
        this.refrashContent(this.content)
    }
}
</script>
