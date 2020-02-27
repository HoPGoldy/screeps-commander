<style lang="stylus" scoped>

</style>

<template lang="pug">
.ma-4
    v-btn(@click="exec" block height="52px") 命令按钮
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'

@Component
export default class CommandItem extends Vue {
    @Emit('send')
    exec() {
        return 'resource'
    }
}
</script>
