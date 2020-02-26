<style lang="stylus" scoped>

</style>

<template lang="pug">
.ma-4
    v-btn(@click="exec" block height="52px") 命令按钮
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
// import { $post } from '../plugins/axios'

@Component
export default class CommandItem extends Vue {
    exec() {
        console.log(123)
    }
}
</script>
