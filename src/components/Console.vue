<style lang="stylus" scoped>
.input-box
    position fixed
    background-color white
    width calc(100% - 98px)
    bottom 4px
.fill-block
    height 100px
</style>

<template lang="pug">
v-list(flat)
    v-list-item-group(color='primary')
        .item(v-for='(item, i) in messageList', :key='i')
            ConsoleItem(:content="item.content" :icon="item.icon")
    .fill-block(ref="itemList")

    v-text-field.input-box.ma-4.mr-8(v-model="inputCommand" @keyup.enter="sendCommand" rounded label="键入命令" solo hide-details clearable)

    v-fab-transition
        v-btn.fab-btn(color='green' dark fixed bottom right fab
            v-show="inputCommand && inputCommand.length > 0"
            @click="sendCommand"
        )
            v-icon mdi-arrow-right-thick
    v-fab-transition
        v-btn.fab-btn(color='pink' dark fixed bottom right fab
            v-show="!inputCommand || inputCommand.length <= 0"
            @click="commandListVisiable = true"
        )
            v-icon mdi-code-braces

    //- 底部弹出的命令输入框
    command-list(:show="commandListVisiable" @on-close="commandListVisiable = false" @on-select="getCommand")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ScreepsApi from '@/plugins/screepsApi'
import Storage from '@/plugins/storage'

import ConsoleItem from './ConsoleItem.vue'
import CommandList from './CommandList.vue'

@Component({
    components: { ConsoleItem, CommandList }
})
export default class Console extends Mixins(ScreepsApi) {
    // 所有信息的保存队列
    messageList: ConsoleMessage[] = []

    // 是否显示底部的命令选择框
    commandListVisiable = false

    // 用户手动输入的命令
    inputCommand = ''

    // screeps 的 ws 实例
    screepsWebSock!: WebSocket

    /**
     * 向服务器发送命令
     */
    sendCommand() {
        if (!this.inputCommand || this.inputCommand.length <= 0) return
        // console.log(this.inputCommand)

        this.sendConsoleExpression(this.inputCommand, 'shard3')

        // 显示该信息
        this.messageList.push({
            content: this.inputCommand,
            icon: 'mdi-arrow-top-left'
        })

        this.inputCommand = ''

        // 向下滚动
        this.$vuetify.goTo(this.$refs.itemList as HTMLElement, { duration: 1000 })
    }

    /**
     * 回调 - 用户从命令列表中选择了一个命令
     */
    getCommand(cmd: string) {
        console.log('收到命令', cmd)
        this.commandListVisiable = false
    }

    /**
     * 回调 - ws 服务端发送数据
     *
     * @param e 接受到的信息对象
     */
    onMessage(e: MessageEvent) {
        // 具有实际载荷的消息才会被解析
        if (e.data[0] !== 'a') return

        try {
            // 后面写死的 [0] 是因为控制台日志都报错在该条目里
            const dataStr = JSON.parse(e.data.substring(1))[0]
            // 后面写死的 [1] 是因为第一个元素是用户的 id，第二个元素包含的是控制台的实际输出
            const data: ScreepsConsoleMessage = JSON.parse(dataStr)[1]
            const logs = data.messages.results

            // 由于 screeps ws 每 tick 都会返回一条信息，所以会包含大量的如下空数据，这里将其剔除不显示
            if (logs.length <= 0) return

            // 显示消息
            this.messageList.push({
                content: logs.join('|||'),
                icon: 'mdi-arrow-bottom-right'
            })
        }
        catch (error) {
            // console.log('onMessage 数据解析出错', error, e)
        }
    }

    mounted() {
        // 初始化 screeps 所有后端设置
        // 初始完成后设置接受数据回调
        // this.initScreepsApi().then(ws => {
        //     ws.onmessage = this.onMessage
        // })
    }

    destroyed() {
        this.closeWebSocket()
    }
}
</script>
