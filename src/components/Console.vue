<style lang="stylus" scoped>
.input-box
    position fixed
    background-color white
    width 100%
    bottom 56px
</style>

<template lang="pug">
v-container.pa-0
    .console-list
        ConsoleItem.ma-16(v-for="item in 2" :key="item")
    //- .input-box.py-1
    //-     v-text-field.ma-2(label='键入命令' outlined hide-details='auto')
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import ConsoleItem from './ConsoleItem.vue'

@Component({
    components: {
        ConsoleItem
    }
})
export default class Console extends Vue {
    // websock = new WebSocket('wss://screeps.com/socket/132/xiskdoqb/websocket')

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
