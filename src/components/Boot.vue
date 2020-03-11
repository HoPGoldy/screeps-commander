<style lang="stylus" scoped>
.content
    margin-top 4px
    color rgba(0, 0, 0, 0.6)
    line-height 20px
</style>

<template lang="pug">
v-overlay(:value='show')
    v-card.mx-auto(max-width='300' light)
        v-card-title.title.font-weight-regular.justify-space-between.pb-1
            span {{ currentTitle }}
        v-window(v-model='step')
            //- 第一屏
            v-window-item(:value='1')
                .pa-2.pt-0
                    v-list-item(v-for="content, index in introduceContent" :key="index")
                        v-list-item-content
                            v-list-item-title.font-weight-bold {{content.title}}
                            .content {{content.text}}
            //- 第二屏
            v-window-item(:value='2')
                v-divider
                //- 登录方式切换 tab
                v-tabs.mb-4(v-model="loginTab" fixed-tabs)
                    v-tab token
                    v-tab 账号密码

                v-tabs-items(v-model='loginTab')
                    //- token 登录框
                    v-tab-item(key="token")
                        v-card-text.pt-0
                            v-text-field(v-model="token" label='Screeps AuthToken' hide-details)
                            .mt-5.caption.grey--text.text--darken-1
                                | token 将会被保存至本地以执行免验证登录。点击 此处 来生成您的 token。
                    //- 账号密码登录框
                    v-tab-item(key="account")
                        v-card-text.pt-0
                            v-text-field(v-model="email" label='Screeps 登陆邮箱' hide-details)
                            v-text-field.mt-2(v-model="password" label='Screeps 登陆密码' @keyup.enter="next" hide-details
                                :append-icon="passwordVisiable ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordVisiable ? 'text' : 'password'"
                                @click:append="passwordVisiable = !passwordVisiable"
                            )
                            .mt-5.caption.grey--text.text--darken-1
                                | 本应用不会记录您的任何身份信息，所以在退出应用后将需要重新登录。
            //- 第三屏
            v-window-item(:value='3')
                .pa-2.pt-0.text-center
                    v-list-item
                        v-list-item-content
                            .title.mb-4 欢迎回来！
                            .subtitle-1 现在你可以直接与 Screeps 控制台进行交互，所有控制台输出也会直接反馈到本应用中。
                            .subtitle-1 同时你也可以自定义快捷命令来快速执行某些常用操作。点击左上角菜单来了解更多操作。
        v-divider
        //- 下方前进后退按钮
        v-card-actions
            v-btn(:disabled='step === 1' text @click='step--')
                | 上一步
            v-spacer
            v-btn(color='primary' depressed @click="next" :loading="confirmBtnLoading")
                | 确认
</template>

<script lang="ts">
/**
 * 初始化引导弹框
 * 本组件只会在应用初次加载（未找到本地存储）时调用
 */
import ScreepsApi from '@/plugins/screepsApi'
import Storage from '@/plugins/storage'
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'

@Component
export default class Boot extends Mixins(ScreepsApi) {
    // 介绍信息
    introduceContent = [
        {
            title: '数据',
            text: '本应用所有数据均保存在本地，自动或手动清除浏览器缓存将可能导致数据丢失（确保浏览器已退出无痕模式），请妥善使用导出 / 导入功能。'
        },
        {
            title: '网络',
            text: '本应用不会优化与 Screeps 的连接质量，在网络不好时可能会出现命令丢失等问题。'
        },
        {
            title: '开源',
            text: '本应用代码已开源至 github。更多信息请访问”关于“页。'
        }
    ]

    // 当前选择的登录方式标签页
    // tab 的当前选择页，0 为 token 登录，1 为账号登录，不知道为什么 v-tabs 不支持自定义自定义索引值
    loginTab: 0 | 1 = 0

    // 当前引导所处的页面位置
    step = 1

    // 是否显示该引导页
    @Prop()
    show!: boolean

    // 密码是否可见
    passwordVisiable = false

    // 登陆token、用户名及密码
    token = ''
    email = ''
    password = ''

    // 令牌，将在登陆成功后获取
    sessionToken = ''

    // 确认按钮是否载入中
    confirmBtnLoading = false

    // 设置每个阶段的标题
    get currentTitle () {
        switch (this.step) {
        case 1: return '使用须知'
        case 2: return '账户确认'
        case 3: return ''
        default: return '初始化'
        }
    }

    /**
     * 完成初始化工作
     * 在本地新建数据结构并触发完成初始化的回调
     */
    @Emit('on-finish')
    finishBoot(): LoginSuccessEvent {
        Storage.init()

        return {
            token: this.sessionToken,
            type: this.loginTab === 0 ? 'token' : 'account'
        }
    }

    /**
     * 回调 - 点击下一步按钮
     */
    next() {
        if (this.step === 2) this.login()
        else if (this.step === 3) this.finishBoot()
        else this.step++
    }

    /**
     * 登陆验证
     * 会确认用户的登陆信息是否正确
     */
    login() {
        if (this.confirmBtnLoading) return

        if (this.loginTab === 0) this.tokenAuth()
        else if (this.loginTab === 1) this.accountAuth()
    }

    /**
     * 使用 token 进行登录
     * 该方法会尝试获取玩家的心理来进行验证
     * 验证成后该方法会自动保存 token 到本地
     */
    tokenAuth() {
        if (!this.token) return

        // 设置页面状态
        this.confirmBtnLoading = true
        this.$toast.info('正在向 Screeps 服务器验证身份...')

        this.getPlayerInfo(this.token).then(resp => {
            // 用 token 登录的话其实用户填写的 token 和验证成功后返回的新的 seesionToken 是一样的
            Storage.setToken(this.token)
            this.sessionToken = resp.sessionToken

            this.step++
            this.$toast.success('验证成功，免登陆验证已启用')
            this.confirmBtnLoading = false
        }).catch((e: Error) => {
            this.confirmBtnLoading = false
            this.$toast.error(e.message.includes('401') ? '验证失败，请检查 token 是否正确' : '验证失败, 错误信息如下: ' + e.message)
        })
    }

    /**
     * 使用账户密码进行登录
     * 该方法会用账户密码去获取 sessionToken，获取成功后会将该 token 代替 authToken 返回给控制台
     * 不会保存账号密码
     */
    accountAuth() {
        if (!this.email || !this.password) return

        // 设置页面状态
        this.confirmBtnLoading = true
        this.$toast.info('正在向 Screeps 服务器验证身份...')

        // 发起请求
        this.getSessionToken(this.email, this.password).then(token => {
            this.sessionToken = token
            this.step++
            this.$toast.success('验证成功')
            this.confirmBtnLoading = false
        }).catch((e: Error) => {
            this.confirmBtnLoading = false
            this.$toast.error(e.message.includes('401') ? '验证失败，请检查用户名密码是否正确' : '验证失败, 错误信息如下: ' + e.message)
        })
    }
}
</script>
