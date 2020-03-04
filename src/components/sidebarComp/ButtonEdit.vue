<template lang="pug">
v-card
    v-card-title.title.font-weight-regular.justify-space-between.pb-1
        span {{editMode ? '编辑按钮' : '添加新按钮'}}
        v-spacer
        v-btn(icon @click="showHelp = true")
            v-icon mdi-help-circle-outline
    v-card-text
        //- 按钮基本信息
        v-text-field.mb-4(v-model="commandInfo.title" label='名称' hide-details clearable)
        v-text-field.mb-4(v-model="commandInfo.shard" label='目标 shard' hide-details clearable)
        v-textarea.mb-4(v-model="commandInfo.body" label='命令' hide-details auto-grow clearable rows="1")

        //- 按钮参数列表
        .mt-5
            template(v-for="param, index in params")
                .mb-2.d-flex.justify-space-between
                    //- 移除参数按钮
                    v-btn.mr-2(color="error" small icon @click="removeParam(index)")
                        v-icon mdi-close-circle
                    //- 编辑参数按钮，插槽里是参数名和占位符
                    v-btn.flex-grow-1(small @click="editParam(index)")
                        span.d-inline-block.text-truncate.text-no-wrap {{param.label}}
                        v-spacer
                        span {{param.match}}
            v-btn(block small @click="addNewParam") 添加参数

    v-divider
    v-card-actions
        v-btn(depressed width="100" @click="showCancelConfirm = true") {{editMode ? '返回' : '放弃'}}
        v-spacer
        v-btn(color='primary' width="100" depressed @click="saveNewButton") {{editMode ? '保存' : '创建'}}

    //- 放弃编辑弹窗
    v-dialog(v-model='showCancelConfirm')
        v-card
            v-card-text.pa-4
                .text-center.mb-4 确认放弃编辑？{{editMode ? '新修改的内容不会被保存' : '该按钮的所有配置都将被清空。'}}
                v-btn(color='error' block @click='cancel') 确认

    //- 帮助弹窗
    button-help(:show="showHelp" @on-close="showHelp = false")

    //- 参数弹窗
    param-config(v-model="editParamData" :show="showParamConfig" @on-cancel="showParamConfig = false" @on-confirm="updateParam")
</template>

<script lang="ts">
import Storage from '@/plugins/storage'
import { Vue, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import { DEFAULT_SHARD_NAME } from '@/config'

import Comp from './commandButtonComp'

@Component({
    components: { ...Comp }
})
export default class ButtonEdit extends Vue {
    @Prop()
    editIndex!: number

    @Watch('editIndex')
    switchToEditMode(editIndex: number) {
        // 大于 0 时才会切换状态
        if (this.editIndex < 0) return

        this.editMode = true

        // 把对应的数据存放到对应的位置，这里深拷贝一下，防止直接把存储里的数据改掉
        const targetCommand = JSON.parse(JSON.stringify(Storage.get().commands[editIndex]))
        this.params = targetCommand.param
        this.commandInfo = targetCommand
    }

    // 是否启用编辑模式，默认为新建模式
    editMode = false

    // 新命令的参数列表
    params: CommandParam[] = []

    // 是否显示确认取消弹窗
    showCancelConfirm = false

    // 是否显示帮助弹窗
    showHelp = false

    // 是否显示参数编辑弹窗
    showParamConfig = false
    // 正在修改的参数索引
    editParamIndex = 0
    // 编辑中的参数（参数编辑弹出框中的内容）
    editParamData: CommandParam = {
        label: '',
        default: '',
        match: ''
    }

    // 按钮的基础数据
    commandInfo = {
        // 标题，显示在弹出窗口中
        title: '新按钮',
        // 要发送到的 shard
        shard: DEFAULT_SHARD_NAME,
        // 命令主体
        body: 'Game.time'
    }

    // 添加新参数
    addNewParam() {
        let paramIndex = this.params.length
        const matchs = this.params.map(param => param.match)

        // 避免有占位符重复
        while (matchs.includes(`$${paramIndex}`)) {
            paramIndex += 1
        }

        // 推入新的参数
        this.params.push({
            label: `参数${paramIndex}`,
            default: '',
            match: `$${paramIndex}`
        })
    }

    /**
     * 移除参数
     *
     * @param index 要移除的参数在 this.params 中的索引
     */
    removeParam(index: number) {
        this.params.splice(index, 1)
    }

    /**
     * 回调 - 开始编辑参数
     *
     * @param index 要编辑的参数在 this.params 中的索引
     */
    editParam(index: number) {
        this.editParamIndex = index
        this.editParamData = this.params[index]
        this.showParamConfig = true
    }

    /**
     * 回调 - 更新参数
     * 参数在编辑完成后会触发该回调，通过开始编辑时保存的索引来更新 this.params
     *
     * @param paramData 更新后的参数数据
     */
    updateParam(paramData: CommandParam) {
        this.showParamConfig = false
        this.params[this.editParamIndex] = paramData
    }

    /**
     * 保存编辑成果
     * 会将按钮保存到存储
     * 并返回编辑成功的消息
     */
    @Emit('on-finish')
    saveNewButton(): SidebarEmitEvent {
        const returnContent = this.editMode ? '保存成功' : '添加成功，点击右下角按钮查看'

        if (this.editMode) {
            Storage.updateCommand(this.editIndex, {
                ...this.commandInfo,
                param: this.params
            })
        }
        else Storage.addNewCommand({
            ...this.commandInfo,
            param: this.params
        })

        return {
            show: true,
            color: 'success',
            content: returnContent
        }
    }

    // 确认是否放弃编辑
    @Emit('on-finish')
    cancel(): SidebarEmitEvent {
        return {
            show: false
        }
    }
}
</script>
