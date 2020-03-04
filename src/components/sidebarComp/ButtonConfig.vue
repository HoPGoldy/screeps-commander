<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-title.title.font-weight-regular.justify-space-between.pb-1 按钮配置
    v-list
        .item(v-for="item, index in commands" :key="index")
            v-list-item
                span.d-inline-block.text-truncate.text-no-wrap {{item.title}}
                v-spacer
                v-btn(icon @click="editButton(index)")
                    v-icon mdi-pencil-plus
                v-btn(icon @click="buttonRemovePrepare(index)")
                    v-icon(color="error") mdi-delete
            v-divider(v-if="index != commands.length - 1")

    .d-flex.justify-center.align-center.pb-4.text--secondary(v-if="commands.length === 0")
        v-icon.mr-1(color="grey lighten-1") mdi-emoticon-sad
        div 暂无按钮

    //- 删除按钮弹窗
    v-dialog(v-model='removeConfirmVisiable')
        v-card
            v-card-text.pa-4
                .text-center.mb-4 确认删除？该按钮的所有配置都将被清空。
                v-btn(color='error' block @click='removeButton') 确认

    //- 编辑弹窗
    v-dialog(v-model='editVisiable' eager persistent)
        button-edit(:edit-index="editIndex" @on-finish="onEditFinish")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Storage from '@/plugins/storage'

import ButtonEdit from './ButtonEdit.vue'

@Component({
    components: { ButtonEdit }
})
export default class ButtonConfig extends Vue {
    // 是否显示移除确认弹窗
    removeConfirmVisiable = false

    // 将要移除的按钮索引
    waitRemoveButtonIndex = 0

    // [主要]按钮数据
    commands = Storage.get().commands

    // 是否显示编辑弹窗
    editVisiable = false

    // 要编辑的按钮信息
    // 这个值会在点击编辑按钮时更新，此处的 -1 仅做初始化
    editIndex = -1

    /**
     * 按钮移除前的准备工作
     *
     * @param index 要移除的按钮在 this.commands 中的索引
     */
    buttonRemovePrepare(index: number) {
        this.waitRemoveButtonIndex = index
        this.removeConfirmVisiable = true
    }

    // 移除该按钮
    removeButton() {
        this.removeConfirmVisiable = false
        Storage.removeCommand(this.waitRemoveButtonIndex)
    }

    /**
     * 编辑指定按钮
     *
     * @param index 要编辑的按钮在 this.commands 中的索引
     */
    editButton(index: number) {
        this.editVisiable = true
        this.editIndex = index
    }

    // 回调 - 按钮编辑完成
    onEditFinish() {
        this.editIndex = -1
        this.editVisiable = false
    }
}
</script>
