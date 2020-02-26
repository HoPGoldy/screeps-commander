import axios from 'axios'
import Qs from 'qs'

const servers: IServerList = {
    screeps: 'https://screeps.com'
}

export const $get = (path: string, params = {}, server: Servers = 'screeps') => {
    const url = /http/.test(path) ? path : servers[server] + path
    return axios({ url, params, method: 'get' })
}

export const $post = (path: string, data = {}, server: Servers = 'screeps') => {
    data = Qs.stringify(data)
    const url = /http/.test(path) ? path : servers[server] + path
    return axios({ url, data, method: 'post' })
}

export const $delete = (path: string, data = {}, server: Servers = 'screeps') => {
    const url = /http/.test(path) ? path : servers[server] + path
    return axios({ url, data, method: 'delete' })
}
