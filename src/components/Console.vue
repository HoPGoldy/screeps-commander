<style lang="stylus" scoped>
.input-box
    position fixed
    background-color white
    width 100%
    bottom 56px
</style>

<template lang="pug">
v-list(flat)
    v-list-item-group(v-model='item', color='primary')
        .item(v-for='(item, i) in items', :key='i')
            ConsoleItem(:content="item.content" :icon="item.icon")

    v-fab-transition
        v-btn.fab-btn(@click="showInputBox = !showInputBox" color='pink' transition="scroll-y-transition" dark fixed bottom right fab)
            v-icon mdi-code-braces

    //- 底部弹出的命令输入框
    v-bottom-sheet(v-model='showInputBox')
        v-text-field.pa-2(v-model="inputCommand" autofocus outlined label="键入命令" append-icon="mdi-chevron-double-right" @click:append="sendCommand" solo hide-details clearable)
</template>

<script lang="ts">
import Vue from 'vue'
import ConsoleItem from './ConsoleItem.vue'
import { Component } from 'vue-property-decorator'

@Component({
    components: {
        ConsoleItem
    }
})
export default class Console extends Vue {
    item = 1

    items: IConsoleItem[] = []
    // websock = new WebSocket('wss://screeps.com/socket/132/xiskdoqb/websocket')

    // 是否显示 console 的底部输入框
    showInputBox = false

    // 用户手动输入的命令
    inputCommand = ''

    sendCommand() {
        console.log(this.inputCommand)
        this.showInputBox = !this.showInputBox

        this.items.push({
            content: this.inputCommand,
            icon: 'mdi-arrow-top-left'
        })

        this.inputCommand = ''
    }

    websocketonmessage(e: MessageEvent) {
        console.log('收到消息！', e.data)
    }

    websocketonopen(e: Event) {
        console.log('开启会话！', e)
    }

    websocketonerror(e: Event) {
        console.log('收到错误！', e)
    }

    websocketclose(e: CloseEvent) {
        console.log('会话关闭！', e)
    }

    mounted() {
        // this.websock.onmessage = this.websocketonmessage
        // this.websock.onopen = this.websocketonopen
        // this.websock.onerror = this.websocketonerror
        // this.websock.onclose = this.websocketclose
    }
}
</script>
