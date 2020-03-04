<style lang="stylus" scoped>

</style>

<template lang="pug">
v-list
    .item(v-for="item, index in value" :key="index")
        v-list-item(@click="sendCommand('resource')")
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

    @Emit('select')
    sendCommand(cmd: string) {
        console.log(cmd)
        return cmd
    }
}
</script>
