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

interface IConsoleItem {
    content: string,
    icon: string
}