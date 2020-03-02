<style lang="stylus" scoped>

</style>

<template lang="pug">
v-card
    v-card-title.title.font-weight-regular.justify-space-between.pb-1
        span 重设身份信息
    v-card-text.pt-0
        v-text-field(v-model="email" label='Screeps 登陆邮箱' hide-details)
        v-text-field.mt-2(v-model="password" label='Screeps 登陆密码' hide-details type="password")
        .mt-5.caption.grey--text.text--darken-1
            | 本应用不会上传您的任何个人信息，所有信息均保存在本地
    v-divider
    //- 下方前进后退按钮
    v-card-actions
        v-btn(depressed @click="finish") 取消
        v-spacer
        v-btn(color='primary' depressed @click="login" :loading="confirmBtnLoading") 确认

    //- 消息弹窗
    v-snackbar(v-model="showMessage" :color="messageColor") {{messageText}}
        v-btn(text @click="showMessage = false") 关闭
</template>

<script lang="ts">
import { Component, Mixins, Emit } from 'vue-property-decorator'
import ScreepsApi from '../../plugins/screepsApi'
import StorageApi from '../../plugins/storageApi'

@Component
export default class LoginDataSetter extends Mixins(ScreepsApi, StorageApi) {
    // 登陆用户名及密码
    email = ''
    password = ''

    // 确认按钮是否载入中
    confirmBtnLoading = false

    // 弹出框的基本信息
    showMessage = false
    messageColor = 'success'
    messageText = ''

    /**
     * 登陆验证
     * 会确认用户的登陆信息是否正确
     */
    login() {
        if (this.email === '' || this.password === '') return

        // 设置页面状态
        this.confirmBtnLoading = true
        this.message('info', '正在向 Screeps 服务器验证身份...')

        // 发起请求
        this.getSessionToken(this.email, this.password).then(() => {
            this.message('success', '验证成功')
            this.confirmBtnLoading = false

            // 重设本地存储中的账号密码
            this.storage.loginData = {
                email: this.email,
                password: this.password
            }

            this.finish()
        }).catch(() => {
            this.confirmBtnLoading = false
            this.message('error', '验证失败，请验证用户名密码是否正确')
        })
    }

    // 消息弹窗的封装
    message(color: string, text: string) {
        this.messageColor = color
        this.messageText = text
        this.showMessage = true
    }

    @Emit('on-finish')
    finish() { }
}
</script>
