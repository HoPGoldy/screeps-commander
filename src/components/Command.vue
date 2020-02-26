<style lang="stylus" scoped>

</style>

<template lang="pug">
.command-container
    template(v-for="i in 6")
        CommandItem
</template>

<script lang="ts">
import Vue from 'vue'
import CommandItem from './CommandItem.vue'

export default Vue.extend({
    name: 'Command',
    components: { CommandItem },

    data: () => ({

    }),
    mounted() {
        console.log(this.$vuetify)
    }
})
</script>
