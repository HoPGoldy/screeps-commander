declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

// 所有的后台接口服务器名称
type Servers = 'screeps'

// 接口服务器地址列表
type ServerList = {
    [server in Servers]: string
}

// 控制台信息组件所需的数据格式
interface ConsoleMessage {
    content: string[]
    icon: string
    loading: boolean
}

// 侧边栏”完成工作“回调的返回信息
interface SidebarEmitEvent {
    // 是否需要显示下述信息
    show: boolean
    // 要显示信息弹窗的颜色
    color?: string
    // 要显示信息弹窗的内容
    content?: string
}

// 玩家信息格式
interface PlayerInfo {
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
        log: string[];
        // 控制台消息正文
        results: string[];
    }
    // 哪个 shard 的消息
    shard: string
}

// 本地存储数据结构
interface LocalDataBase {
    // 玩家创建的所有命令
    commands: Command[]
    // 控制台命令默认发送到的 shard
    shard: string
}

// 保存下来的命令数据
interface Command {
    // 标题，显示在弹出窗口中
    title: string
    // 要发送到的 shard
    shard: string
    // 命令主体
    body: string
    // 命令中包含的参数列表
    param: CommandParam[]
}

// 命令参数数据
interface CommandParam {
    // 在填写参数时给出的提示
    label: string
    // 该参数的默认值
    default: string
    // 占位符，用于在命令主体中进行参数替换
    match: string
}

// parameter-collecter 收集到的参数，包含用户填写的具体值
interface ParamData {
    match: string
    value: string
}

// 用户在命令列表中点击一个按钮所返回的数据
interface GetCommandEvent {
    command: string
    shard: string
}
