<style lang="stylus" scoped>

</style>

<template lang="pug">
.command-container
    template(v-for="i in 6")
        CommandItem
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import CommandItem from './CommandItem.vue'

@Component({
    components: { CommandItem }
})
export default class Command extends Vue {

}
</script>
