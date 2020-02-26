<style lang="stylus" scoped>

</style>

<template lang="pug">
.console-container
    ConsoleItem.ma-16(v-for="item in 1" :key="item")
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

}
</script>
