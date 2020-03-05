<style lang="stylus" scoped>

</style>

<template lang="pug">
v-bottom-sheet(v-model='sheetVisiable' @click:outside="close")
    v-list
        .item(v-for="item, index in commandListData" :key="index")
            v-list-item(@click="onCommandClick(item)")
                v-chip.mr-3(small disabled) {{item.shard}}
                span.d-inline-block.text-truncate.text-no-wrap {{item.title}}
            v-divider(v-if="index != commandListData.length - 1")
    parameter-collecter(v-model="collectingParam" :show="parameterCollecterVisiable" @on-close="onParamClose" @on-finish="onParamFinish")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import Storage from '@/plugins/storage'

import ParameterCollecter from './commandComp/ParameterCollecter.vue'

@Component({
    components: { ParameterCollecter }
})
export default class CommandList extends Vue {
    @Prop({
        required: true,
        default: false
    })
    // 是否显示本组件
    show!: boolean

    // 本属性和上面的 show 属性的值是相同的，这里的目的是为了方式非法修改 prop 传递过来的值
    sheetVisiable = false

    // 所有按钮的数据
    commandListData: Command[] = []

    @Watch('show')
    updateData(show: boolean) {
        this.sheetVisiable = show
        if (!show) return

        this.commandListData = Storage.get().commands
    }

    // 是否显示参数收集弹窗
    parameterCollecterVisiable = false

    // 等待收集的参数，用于初始化 parameter-collecter 组件
    collectingParam: CommandParam[] = []

    // 被选中的命令主体与 shard 名
    selectCommand = ''
    selectShard = ''

    /**
     * 回调 - 当命令按钮被点击
     *
     * @param commandData 被点击的命令按钮数据
     */
    onCommandClick(commandData: Command) {
        this.selectCommand = commandData.body
        this.selectShard = commandData.shard

        // 如果需要输入参数的话就把点击的命令保存下来，然后弹出参数收集框
        if (commandData.param.length > 0) {
            this.collectingParam = commandData.param
            this.parameterCollecterVisiable = true
        }
        // 否则直接发送命令
        else this.sendCommand(commandData.body)
    }

    // 触发回调 - 返回用户点击的命令给父组件
    @Emit('on-select')
    sendCommand(cmd: string): GetCommandEvent {
        return {
            command: cmd,
            shard: this.selectShard
        }
    }

    // 触发回调 - 点击外部区域关闭
    @Emit('on-close')
    close() { }

    // 回调 - 用户放弃填写参数
    onParamClose() {
        this.parameterCollecterVisiable = false
    }

    // 回调 - 参数填写完成
    onParamFinish(data: ParamData[]) {
        this.parameterCollecterVisiable = false
        // 将收到的参数和命令组装在一起
        const command = this.buildCommand(this.selectCommand, data)

        this.sendCommand(command)
    }

    /**
     * 组装命令
     *
     * @param body 包含占位符的命令主体
     * @param paramData 占位符及对应的参数值
     * @returns 组装好的命令
     */
    buildCommand(body: string, paramData: ParamData[]): string {
        let command = body
        paramData.map(param => {
            command = command.replace(new RegExp(`\\${param.match}`, 'g'), param.value)
        })
        return command
    }
}
</script>
