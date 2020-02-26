<style lang="stylus" scoped>

</style>

<template lang="pug">
.command-container
    template(v-for="i in 6")
        .ma-4
            v-btn(block height="52px") 命令按钮
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'Command',

    data: () => ({

    }),
    mounted() {
        console.log(this.$vuetify)
    }
})
</script>
