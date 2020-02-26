<style lang="stylus" scoped>

</style>

<template lang="pug">
.ma-4
    v-btn(@click="exec" block height="52px") 命令按钮
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'CommandItem',

    data: () => ({

    }),

    methods: {
        exec() {
            console.log('123321')
        }
    }
})
</script>
