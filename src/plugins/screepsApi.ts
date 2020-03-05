import { Component, Vue } from 'vue-property-decorator'
import { AxiosResponse } from 'axios'
import { $get, $post } from './axios'

@Component
export default class ScreepsApi extends Vue {
    /**
     * ws 实例
     * 在 initScreepsApi 中完成实例化
     */
    screepsWebSock!: WebSocket

    /**
     * 用户信息
     */
    playerInfo!: PlayerInfo

    /**
     * 初始化 Screeps 的 Api 访问
     *
     * @param token 初始化 ws 需要的 SESSION_TOKEN
     */
    initScreepsApi(token: string) {
        // 获取 玩家的 id，用来订阅 console
        const promiseGetPlayId = this.getPlayerInfo(token)
        // 获取 screeps 的 webSocket
        const promiseInitWs = this.initWebSocket()

        // 两个都获取好了之后订阅 console
        return Promise.all([promiseGetPlayId, promiseInitWs])
            .then(([info, ws]) => {
                // 保存用户信息
                this.playerInfo = info

                // 验证用户 sessionToken
                return this.authSessionToken(ws, info.sessionToken)
            })
            .then(({ ws, sessionToken }) => {
                console.log('准备就绪！', sessionToken, ws)
                // 存储到本地
                this.screepsWebSock = ws
                // 更新 sessionToken
                this.playerInfo.sessionToken = sessionToken

                // 订阅控制台
                return this.subscribeConsole(this.screepsWebSock, this.playerInfo.userId)
            })
    }

    /**
     * 初始化 screeps 所需的 webSocket
     *
     * @returns Promise 可以进行正常访问的 WebSocket
     */
    initWebSocket(): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            // 开启 screeps 的 ws 需要 3 位的随机数字和 8 位的随机字符
            const screepsUrl = `wss://screeps.com/socket/${this.getRandStr('number', 3)}/${this.getRandStr('string', 8)}/websocket`
            console.log('TCL: ScreepsApi -> screepsUrl', screepsUrl)
            const screepsWebSock = new WebSocket(screepsUrl)

            // open 成功就返回 ws，失败就 reject
            screepsWebSock.onopen = () => resolve(screepsWebSock)
            screepsWebSock.onerror = (e: Event) => reject(e)
        })
    }

    /**
     * 获取玩家信息
     *
     * @param token 用于获取玩家信息的 SESSION_TOKEN
     * @returns Promise 玩家的用户信息
     */
    getPlayerInfo(token: string): Promise<PlayerInfo> {
        return new Promise((resolve, reject) => {
            $get('/api/auth/me', {}, { 'X-token': token }).then(resp => {
                // console.log('TCL: ScreepsApi -> resp', resp)
                if (resp.status === 200 && resp.data.ok === 1) resolve({
                    username: resp.data.username,
                    userId: resp.data._id,
                    money: resp.data.money,
                    sessionToken: resp.config.headers['X-token']
                })
                else reject(resp.status)
            })
        })
    }

    /**
     * 向 screeps 发送命令
     *
     * @param cmd 要发送的命令
     * @param shard 要发送到的 shard
     */
    sendConsoleExpression(cmd: string, shard: string): Promise<AxiosResponse> {
        return $post('/api/user/console', {
            expression: cmd,
            shard
        }, { 'X-token': this.playerInfo.sessionToken })
    }

    /**
     * 向 screeps ws 发起验证
     *
     * @param ws 要进行验证的 webSock
     * @param sessionToken 执行验证的 token
     */
    authSessionToken(ws: WebSocket, sessionToken: string): Promise<ScreepsTokenAuthResult> {
        return new Promise((resolve, reject) => {
            ws.send(`["auth ${sessionToken}"]`)

            // 暂时劫持 message 回调，用来确认验证是否成功
            ws.onmessage = (e: MessageEvent) => {
                // 只有类型为 a 时才是验证回应
                if (e.data[0] !== 'a') return

                // 解析回应内容
                const authResult = JSON.parse(e.data.substring(1))[0]

                // 验证返回的值肯定为下属两者之一
                if (authResult.includes('auth ok')) resolve({
                    ws,
                    sessionToken: authResult.split(' ')[2]
                })
                else if (authResult.includes('auth failed')) reject(e)
            }
        })
    }

    /**
     * 订阅控制台
     *
     * @param ws screeps websock
     * @param userId 要订阅控制台的玩家 id
     */
    subscribeConsole(ws: WebSocket, userId: string): Promise<WebSocket> {
        return new Promise((resolve) => {
            ws.send(`["subscribe user:${userId}/console"]`)
            console.log('已订阅控制台')

            resolve(ws)
        })
    }

    /**
     * 获取 SESSION_TOKEN
     * 需要玩家的邮箱和密码
     *
     * @returns Promise 玩家的 SESSION_TOKEN
     */
    getSessionToken(email: string, password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            $post('/api/auth/signin', { email, password }).then(resp => {
                if (resp.status === 200 && resp.data.ok === 1) resolve(resp.data.token)
                else {
                    console.log('123', resp)
                    reject(resp)
                }
            }).catch(e => reject(e))
        })
    }

    /**
     * 获取指定长度的随机字符串
     *
     * @param type 类型
     * @param length 目标长度
     * @returns 生成的随机字符串
     */
    getRandStr(type: 'number' | 'string', length: number): string {
        // 创建随机挑选的目标集合
        const target = (type === 'number') ? '0123456789' : 'abcdefghijklmnopqrstuvwxyz'

        let randStr = ''
        for (let i = 0; i < length; i++) {
            randStr += target.charAt(Math.floor(Math.random() * target.length))
        }
        return randStr
    }

    /**
     * 解析 screeps ws 返回的字符串内容
     *
     * @param message 要进行解析的字符串
     */
    getDataInMessage(message: string): string[] {
        if (message[0] === 'a' || message[0] === 'm') return JSON.parse(message.substr(1, message.length))
        else return ['']
    }

    /**
     * 关闭 socket
     */
    closeWebSocket(): void {
        if (!this.screepsWebSock) return

        this.screepsWebSock.close()
    }
}
