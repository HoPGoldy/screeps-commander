<style lang="stylus" scoped>

</style>

<template lang="pug">
v-list
    .item(v-for="item, index in value" :key="index")
        v-list-item(@click="onCommandClick(item)")
            v-chip.mr-3(small disabled) {{item.shard}}
            span {{item.title}}
        v-divider(v-if="index != value.length - 1")
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class CommandList extends Vue {
    @Prop({
        required: true,
        default: []
    })
    // 所有按钮的数据
    value!: Command[]

    /**
     * 回调 - 当命令按钮被点击
     *
     * @param commandData 被点击的命令按钮数据
     */
    onCommandClick(commandData: Command) {
        if (commandData.param.length > 0) {
            console.log('收集参数！')
        }
        else this.sendCommand(commandData.body)
    }

    @Emit('select')
    sendCommand(cmd: string) {
        console.log(cmd)
        return cmd
    }
}
</script>
