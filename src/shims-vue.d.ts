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

// 本地存储数据结构
interface LocalDataBase {
    // 登陆信息
    loginData: PlayerLoginData
    // 玩家创建的所有命令
    commands: ICommand[]
}

// 保存下来的命令数据
interface ICommand {
    // 标题，显示在弹出窗口中
    title: string
    // 介绍，现在在标题下方
    introduce: string
    // 命令主体
    body: string
    // 命令中包含的参数列表
    param: ICommandParam[]
}

// 命令参数数据
interface ICommandParam {
    // 在填写参数时给出的提示
    label: string
    // 占位符，用于在命令主体中进行参数替换
    match: string
}

// 用户登陆信息
interface PlayerLoginData {
    // 用户名
    email: string
    // 密码
    password: string
}