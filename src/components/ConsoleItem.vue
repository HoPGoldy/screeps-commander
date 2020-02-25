<style lang="stylus" scoped>

</style>

<template lang="pug">
v-skeleton-loader(:loading="loading" transition="scale-transition" type="list-item-three-line")
    v-card.ma-4
        v-container.py-0.mr-0
            v-row(justify='space-between')
                v-col(cols='auto')

                v-col.text-center.pl-0(cols='auto')
                    v-row.flex-column.ma-0.fill-height(justify='center')
                        v-col.pa-0
                            v-btn(icon)
                                v-icon mdi-heart
                        v-col.pa-0
                            v-btn(icon)
                                v-icon mdi-bookmark
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'ConsoleItem',

    data: () => ({
        loading: true
    })
})
</script>
