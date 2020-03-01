import axios from 'axios'
import Qs from 'qs'

const servers: IServerList = {
    screeps: 'https://cors-anywhere.herokuapp.com/https://screeps.com'
}

axios.interceptors.request.use(axiosConfig => {
    // axiosConfig.headers['X-Token'] = ''

    return axiosConfig
})

export const $get = (path: string, params = {}, headers = {}, server: Servers = 'screeps') => {
    const url = /http/.test(path) ? path : servers[server] + path
    return axios({ url, params, method: 'get', headers })
}

export const $post = (path: string, data = {}, headers = {}, server: Servers = 'screeps') => {
    data = Qs.stringify(data)
    const url = /http/.test(path) ? path : servers[server] + path
    return axios({ url, data, method: 'post', headers })
}
