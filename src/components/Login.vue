<style lang="stylus" scoped>
.content
    margin-top 4px
    color rgba(0, 0, 0, 0.6)
    line-height 20px
</style>

<template lang="pug">
v-overlay(:value='show')
    v-card.mx-auto(max-width='300' light)
        v-card-title.title.font-weight-regular.justify-space-between.pb-1 身份认证
        v-card-text.px-2.pb-2
            v-text-field.ma-2(v-model="email" label='Screeps 登陆邮箱' hide-details)
            v-text-field.ma-2(v-model="password" label='Screeps 登陆密码' hide-details @keyup.enter="login"
                :append-icon="passwordVisiable ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordVisiable ? 'text' : 'password'"
                @click:append="passwordVisiable = !passwordVisiable"
            )
            .ma-2.caption.grey--text.text--darken-1
                | 本应用不会记录您的任何身份信息，所以在退出应用后将需要重新登录。

            v-btn(color='primary' block depressed @click="login" :loading="loading") 登陆

    //- 消息弹窗
    v-snackbar(v-model="showMessage" :color="messageColor") {{messageText}}
        v-btn(text @click="showMessage = false") 关闭
</template>

<script lang="ts">
/**
 * 登陆组件
 * 在应用刚打开时调用
 */
import ScreepsApi from '@/plugins/screepsApi'
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'

@Component
export default class Login extends Mixins(ScreepsApi) {
    // 是否显示该组件
    @Prop()
    show!: boolean

    // 密码是否可见
    passwordVisiable = false

    // 登陆用户名及密码
    email = ''
    password = ''

    // 确认按钮是否载入中
    loading = false

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

        // 设置为登陆中
        this.loading = true
        this.message('info', '正在向 Screeps 服务器验证身份...')

        // 发起请求
        this.getSessionToken(this.email, this.password).then(token => {
            this.message('success', '验证成功')
            this.loginSuccess(token)
        }).catch(() => {
            this.loading = false
            this.message('error', '验证失败，请验证用户名密码是否正确')
        })
    }

    /**
     * 触发回调 - 登陆成功
     * 会将登陆时获取的 token 返回给控制台来开启 webSocket
     *
     * @param sessionToken 登陆时返回的 token
     */
    @Emit('on-success')
    loginSuccess(sessionToken: string): string {
        return sessionToken
    }

    // 消息弹窗的封装
    message(color: string, text: string) {
        this.messageColor = color
        this.messageText = text
        this.showMessage = true
    }
}
</script>
