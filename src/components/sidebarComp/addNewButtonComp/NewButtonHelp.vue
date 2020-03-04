<style lang="stylus" scoped>
.lh
    line-height 20px
</style>

<template lang="pug">
v-dialog(v-model='show' @click:outside="onClose")
    v-card
        v-card-text.pa-2
            //- 遍历显示所有帮助信息
            v-list-item(v-for="item, index in info" :key="index")
                v-list-item-content
                    v-list-item-title.font-weight-bold {{item.title}}
                    .pt-1.lh {{item.content}}
                    code.mt-2.pa-1(v-if="item.code") {{item.code}}
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class NewButtonHelp extends Vue {
    // 本页显示的所有数据
    info = [
        {
            title: '命令',
            content: '命令是点击该按钮时发送到 screeps 的代码主体。支持任何可以在游戏控制台中执行的表达式。如下：',
            code: 'Object.key(Game.creeps).length'
        },
        {
            title: '参数',
            content: '为了提高功能性，你可以通过新建多个参数来实现诸如 ”从某房发送某资源到某房“ 的操作。参数会在点击按钮时通过弹出框进行收集。'
        },
        {
            title: '占位符',
            content: '占位符代表着参数将要插入到的命令位置，参数在新建时会自动分配一个无法修改的占位符（以 $ 开头）。如果在命令中没有找到对应的占位符，该参数将被抛弃。',
            code: 'Game.rooms.$1.controller.level'
        }
    ]

    // 是否显示该组件
    @Prop({
        required: true
    })
    show!: boolean

    // 回调 - 该组件被关闭
    @Emit('on-close')
    onClose() { }
}
</script>
