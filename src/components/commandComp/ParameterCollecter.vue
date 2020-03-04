<style lang="stylus" scoped>

</style>

<template lang="pug">
v-dialog(v-model='show' persistent)
    v-card
        v-card-title.title.font-weight-regular.justify-space-between.pb-1 请填写参数

        //- 遍历绘制所有参数输入框
        .mx-2.px-2(v-for="item, index in paramInputs" :key="index")
            v-text-field.mb-4(v-model="item.value" :label='item.label' hide-details clearable)

        v-divider
        v-card-actions
            v-btn(width="100" @click="close") 放弃
            v-spacer
            v-btn(width="100" color='primary' depressed @click="returnParam") 确认
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Watch } from 'vue-property-decorator'

@Component
export default class ParameterCollecter extends Vue {
    @Prop({
        required: true,
        default: []
    })
    // 参数收集表单的信息
    value!: CommandParam[]

    @Prop({
        required: true
    })
    // 是否显示该组件
    show = false

    // 用户填写的参数值
    // 在 loadDefaultValue 初始化
    paramInputs: ParamData[] = []

    // 通过输入的参数默认值进行初始化
    @Watch('show')
    loadDefaultValue(show: boolean) {
        if (!show) return

        this.paramInputs = this.value.map(param => ({
            ...param,
            value: param.default
        }))
    }

    // 触发回调 - 关闭本组件
    @Emit('on-close')
    close() { }

    // 触发回调 - 完成输入
    @Emit('on-finish')
    returnParam(): ParamData[] {
        return this.paramInputs.map(input => ({
            match: input.match,
            value: input.value
        }))
    }
}
</script>
