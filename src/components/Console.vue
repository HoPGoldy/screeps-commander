<style lang="stylus" scoped>

</style>

<template lang="pug">
.console-container
    ConsoleItem.ma-16(v-for="item in 1" :key="item")
</template>

<script lang="ts">
import Vue from 'vue'
import ConsoleItem from './ConsoleItem.vue'

export default Vue.extend({
    name: 'Console',
    components: { ConsoleItem },

    data: () => ({

    })
})
</script>
