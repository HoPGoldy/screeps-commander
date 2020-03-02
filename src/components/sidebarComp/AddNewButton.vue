<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-title.title.font-weight-regular.justify-space-between.pb-1
        span 添加新按钮
        v-spacer
        v-btn(icon)
            v-icon mdi-help-circle-outline
    v-card-text
        v-text-field.mb-4(label='命令' hide-details clearable)
        template(v-for="arg, index in args")
            .mb-2.d-flex.justify-space-between
                v-btn(color="error" small) x
                v-btn(width="80%" small) {{arg.label}}
        v-btn(block small @click="addNewArg") 添加参数
    v-divider
    v-card-actions
        v-btn(depressed width="100") 放弃
        v-spacer
        v-btn(color='primary' width="100" depressed) 创建
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class AddNewButton extends Vue {
    // 新命令的参数列表
    args: CommandParam[] = []

    addNewArg() {
        const argsLength = this.args.length
        this.args.push({
            label: `参数${argsLength}`,
            match: `$${argsLength}`
        })
    }
}
</script>
