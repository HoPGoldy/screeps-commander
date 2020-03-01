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
                    v-list-item(three-line)
                        v-list-item-content
                            v-list-item-title 隐私
                            .content 本应用所有数据均保存在本地，自动或手动清除浏览器缓存将可能导致数据丢失，请妥善使用导出 / 导入功能。
                    v-list-item(two-line)
                        v-list-item-content
                            v-list-item-title 开源
                            .content 本应用代码已开源至 github。
            //- 第二屏
            v-window-item(:value='2')
                v-card-text.pt-0
                    v-text-field(v-model="email" label='Screeps 登陆邮箱' hide-details)
                    v-text-field.mt-2(v-model="password" label='Screeps 登陆密码' hide-details type="password")
                    .mt-5.caption.grey--text.text--darken-1
                        | 本应用不会上传您的任何个人信息，所有信息均保存在本地

            //- 第三屏
            v-window-item(:value='3')
                .pa-2.pt-0.text-center
                    v-list-item
                        v-list-item-content
                            .title.mb-4 欢迎回来！
                            .subtitle-1 现在你可以直接与 Screeps 控制台进行交互，所有控制台输出也会直接反馈到本应用中。
                            .subtitle-1 同时你也可以自定义快捷命令来快速执行某些常用操作。点击左上角按钮来了解更多操作。
        v-divider
        //- 下方前进后退按钮
        v-card-actions
            v-btn(:disabled='step === 1' text @click='step--')
                | 上一步
            v-spacer
            v-btn(color='primary' depressed @click="next" :loading="confirmBtnLoading")
                | 确认

    //- 消息弹窗
    v-snackbar(v-model="showMessage" :color="messageColor") {{messageText}}
        v-btn(text @click="showMessage = false") 关闭
</template>

<script lang="ts">
/**
 * 初始化引导弹框
 */
import ScreepsApi from '../plugins/screepsApi'
import StorageApi from '../plugins/storageApi'
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator'
import { LOCAL_STORAGE_NAME } from '../config'

@Component
export default class Boot extends Mixins(ScreepsApi, StorageApi) {
    // 当前引导所处的页面位置
    step = 1

    // 是否显示该引导页
    @Prop()
    show!: boolean

    // 登陆用户名及密码
    email = ''
    password = ''

    // 确认按钮是否载入中
    confirmBtnLoading = false

    // 弹出框的基本信息
    showMessage = false
    messageColor = 'success'
    messageText = ''

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
    finishBoot(): PlayerLoginData {
        this.storage = {
            loginData: {
                email: this.email,
                password: this.password
            },
            commands: []
        }

        return {
            email: this.email,
            password: this.password
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
        if (this.email === '' || this.password === '') return

        // 设置页面状态
        this.confirmBtnLoading = true
        this.message('info', '正在向 Screeps 服务器验证身份...')

        // 发起请求
        this.getSessionToken(this.email, this.password).then(resp => {
            this.step++
            this.message('success', '验证成功')
            this.confirmBtnLoading = false
        }).catch(e => {
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
}
</script>
