<style lang="stylus" scoped>

</style>

<template lang="pug">
.command-container
    template(v-for="i in 6")
        CommandItem(@send="sendCommand")
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'
import CommandItem from './CommandItem.vue'

@Component({
    components: { CommandItem }
})
export default class Command extends Vue {
    @Emit('select')
    sendCommand(cmd: string) {
        console.log(cmd)
        return cmd
    }
}
</script>
