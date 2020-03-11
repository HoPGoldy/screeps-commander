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
.console-container
    v-list(dense)
        v-list-item-group(color='primary')
            .item(v-for='item, index in messageList', :key='index')
                console-item(:content="item.content" :icon="item.icon" :loading="item.loading" @on-icon-click="pasteMessage" @on-item-click="onItemClick(item)")
        .fill-block(v-intersect="onIntersect" ref="itemList")

        v-text-field.input-box.ma-4.mr-8(v-model="inputCommand" @keyup.enter="onCommandSend" rounded label="键入命令" solo hide-details clearable)

        v-fab-transition
            v-btn.fab-btn(color='green' dark fixed bottom right fab
                v-show="inputCommand && inputCommand.length > 0"
                @click="onCommandSend"
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

    //- 初始化时的准备工作，boot 比 login 多了个应用介绍
    boot(:show="bootVisable" @on-finish="onLoginSuccess")
    login(:show="loginVisable" @on-success="onLoginSuccess")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ScreepsApi from '@/plugins/screepsApi'
import Storage from '@/plugins/storage'

import Boot from '@/components/Boot.vue'
import Login from '@/components/Login.vue'
import ConsoleItem from './ConsoleItem.vue'
import CommandList from './CommandList.vue'

@Component({
    components: { ConsoleItem, CommandList, Boot, Login }
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

    // 是否展示初始化引导
    bootVisable = false
    // 是否展示登陆页面
    loginVisable = false

    // 列表底部是否可见
    // 会根据该值决定是否在收到新消息时自动滚动
    fillBlockVisiable = false

    /**
     * 回调 - 将该行的内容粘贴到输入框
     *
     * @param data 该行的所有数据
     */
    pasteMessage(data: string[]) {
        this.inputCommand = data.join('\n')
    }

    /**
     * 回调 - 用户尝试发送一条手写命令
     */
    onCommandSend() {
        // 手写命令使用配置好的 shard
        this.sendCommand(this.inputCommand, Storage.get().shard)

        this.inputCommand = ''
    }

    /**
     * 向服务器发送命令
     *
     * @param command 要发送的命令
     * @param shard 要发送到的 shard
     */
    sendCommand(command: string, shard: string) {
        if (!command || command.length <= 0) return

        const message = this.addNewMessage([command], 'mdi-arrow-top-left-thick', true, shard)

        // 发送命令
        this.sendConsoleExpression(command, shard).then(resp => {
            console.log('命令发送完成', resp)
            message.loading = false

            if (resp.data.error) {
                message.icon = 'mdi-alert-circle'
                this.addNewMessage(['发送失败: ' + resp.data.error], 'mdi-alert-circle', false, shard)
            }
        }).catch(error => {
            message.loading = false
            message.icon = 'mdi-alert-circle'
            this.addNewMessage(['啊哦，命令发送失败，请尝试刷新网页并重写登陆', error], 'mdi-alert-circle', false, shard)
        })

        // 显示该信息

        this.scrollToBottom()
    }

    /**
     * 回调 - 底部位置监听
     *
     * @param entries 触发监听的元素
     */
    onIntersect(entries: IntersectionObserverEntry[]) {
        // 更新列表底部元素是否可见
        this.fillBlockVisiable = entries[0].isIntersecting
    }

    // 向下滚动至底部
    scrollToBottom() {
        this.$vuetify.goTo(this.$refs.itemList as HTMLElement, { duration: 1000 })
    }

    /**
     * 回调 - 用户从命令列表中选择了一个命令
     */
    getCommand(e: GetCommandEvent) {
        this.commandListVisiable = false

        // 直接发送命令
        this.sendCommand(e.command, e.shard)
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
            // console.log('results', data.messages.results, 'log', data.messages.log)
            const logs: string[] = []

            // 先看一下是不是错误信息
            if (data.error) {
                this.addNewMessage(data.error.split('\n'), 'mdi-alert-circle', false, data.shard)
            }
            else {
                if (data.messages.log.length > 0) {
                    // 把每一个信息中种的 \n 都拆出来，不然信息加载到 html 中后不会自动换行
                    logs.push(...data.messages.log.map(log => log.split('\n')).flat())
                }
                if (data.messages.results.length > 0) logs.push(...data.messages.results[0].split('\n'))

                // 由于 screeps ws 每 tick 都会返回一条信息，所以会包含大量的空数据，这里将其剔除不显示
                if (logs.length <= 0) return

                // 显示消息
                this.addNewMessage(logs, 'mdi-arrow-bottom-right-thick', false, data.shard)
            }

            // 只有当能看到页面底部时才会自动滚动
            // 防止出现用户在看上面信息时列表没眼色的自动滚动
            if (this.fillBlockVisiable) this.scrollToBottom()
        }
        catch (error) {
            console.log('onMessage 数据解析出错', error, e)
        }
    }

    /**
     * 在列表中添加新的消息
     *
     * @param content 要显示的内容数组
     * @param icon 左侧显示的标签
     * @return 添加好的消息对象
     */
    addNewMessage(content: string[], icon: string, loading = true, shard = ''): ConsoleMessage {
        const date = new Date()

        const message: ConsoleMessage = {
            content,
            icon,
            loading,
            shard,
            date: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        }
        this.messageList.push(message)
        return message
    }

    /**
     * 回调 - 完成初始化工作
     */
    onLoginSuccess(e: LoginSuccessEvent) {
        this.bootVisable = false
        this.loginVisable = false

        this.addNewMessage([e.type === 'token' ? '发现 AuthToken，跳过登录验证' : '登录成功'], 'mdi-key', false)
        const wsMessage = this.addNewMessage(['正在订阅 Screeps WebSocket, 请稍后...'], 'mdi-wifi')
        // 初始化 screeps 所有后端设置
        // 初始完成后设置 ws 的数据接收回调
        this.initScreepsApi(e.token).then(ws => {
            ws.onmessage = this.onMessage
            wsMessage.loading = false
            wsMessage.content = ['Screeps WebSocket 订阅成功!']

            this.addNewMessage(['您现在可以正常与控制台进行交互'], 'mdi-wifi', false)
        }).catch((e: Error) => {
            console.log('该死，初始化 ws 出错了!', e)
            wsMessage.loading = false
            wsMessage.icon = 'mdi-alert-circle'
            wsMessage.content = ['Screeps WebSocket 失败, 请刷新重试']

            if (e.message.includes('401')) this.addNewMessage(['当前登录信息已过期，请检查 token 或账号密码是否正确'], 'mdi-alert-circle', false)
        })
    }

    /**
     * 回调 - 控制台信息被点击
     * 用于显示该信息的一些元数据
     *
     * @param item 该信息的数据
     */
    onItemClick(item: ConsoleMessage) {
        const shardCotent = item.shard ? `所处镜面 ${item.shard} | ` : ''
        this.$toast.info(`${shardCotent}消息时间 ${item.date}`, {
            y: 'top'
        })
    }

    mounted() {
        // 如果本地没有数据存储的话就启动引导, 反之进行初始化
        if (!Storage.exist) this.bootVisable = true
        else {
            Storage.init()

            const token = Storage.get().token
            // 没设置 token 的话就拉起登录，否则直接开始初始化 ws
            if (!token) this.loginVisable = true
            else this.onLoginSuccess({ token, type: 'token' })
        }
    }

    destroyed() {
        this.closeWebSocket()
    }
}
</script>
