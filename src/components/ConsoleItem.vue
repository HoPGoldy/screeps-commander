<style lang="stylus" scoped>
.content
    width 100%
    overflow scroll
</style>

<template lang="pug">
v-skeleton-loader(:loading="loading" transition="scale-transition" type="list-item-three-line")
    v-card.ma-4(elevation="4")
        v-container.py-3.mx-4
            v-row(justify='space-between')
                v-col.px-0.py-1(cols='auto')
                    v-icon mdi-bookmark
            v-row.content {{message}}
                //- v-col.text-center.pl-0(cols='auto')
                //-     v-row.flex-column.ma-0.fill-height(justify='center')
                //-         v-col.pa-0
                //-             v-btn(icon)
                //-                 v-icon mdi-heart
                //-         v-col.pa-0
                //-             v-btn(icon)
                //-                 v-icon mdi-bookmark
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ConsoleItem extends Vue {
    // 是否正在等待 screeps 服务器响应
    loading = false
    message = `template
    v-row(align='center')
        v-col.text-center(cols='12', sm='4')
            .my-2
                v-btn(small='') Normal
            .my-2
                v-btn(small='', color='primary') Primary
            .my-2
                v-btn(small='', color='error') Error
            .my-2
                v-btn(small='', disabled='') Disabled
        v-col.text-center(cols='12', sm='4')
            .my-2
                v-btn Normal
            .my-2
                v-btn(color='primary') Primary
            .my-2
                v-btn(color='error') Error
            .my-2
                v-btn(disabled='') Disabled
        v-col.text-center(cols='12', sm='4')
            .my-2
                v-btn(large='') Normal
            .my-2
                v-btn(large='', color='primary') Primary
            .my-2
                v-btn(large='', color='error') Error
            .my-2
                v-btn(large='', disabled='') Disabled
    `
}
</script>
