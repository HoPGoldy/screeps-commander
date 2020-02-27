declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

// 所有的后台接口服务器名称
type Servers = 'screeps'

// 接口服务器地址列表
type IServerList = {
    [server in Servers]: string
}

// 控制台信息组件所需的数据格式
interface IConsoleItem {
    content: string,
    icon: string
}

// 玩家信息格式
interface IPlayerInfo {
    // 玩家名称
    username: string
    // 玩家 id
    userId: string
    // 玩家金钱
    money: number
    // 新的 sessionToken
    sessionToken: string
}

// screeps token 验证方法的返回值
interface ScreepsTokenAuthResult {
    // 验证通过的 webSock
    ws: WebSocket
    // 更新的 sessionToken
    sessionToken: string
}

// screeps webSock 返回的控制台数据结构
interface ScreepsConsoleMessage {
    messages: {
        // 返回回来的都是空的，不知道这是啥
        log: string[],
        // 控制台消息正文
        results: string[],
    }
    // 哪个 shard 的消息
    shard: string
}