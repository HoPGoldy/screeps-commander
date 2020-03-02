import { Component, Vue } from 'vue-property-decorator'
import { LOCAL_STORAGE_NAME, DEFAULT_SHARD_NAME } from '@/config'

@Component
export default class StorageApi extends Vue {
    // 所有应用数据都保存在该对象中
    dataBase!: LocalDataBase

    // dataBase 的访问器
    get storage(): LocalDataBase {
        // console.log('get 被访问')
        if (!this.dataBase) {
            const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

            // 如果本地没有存储的话就进行初始化工作
            if (!localData) {
                this.dataBase = {
                    loginData: { email: '', password: '' },
                    shard: DEFAULT_SHARD_NAME,
                    commands: []
                }

                // 保存到本地
                localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(this.dataBase))
            }
            // 有本地存储的话就将其实例化
            else this.dataBase = JSON.parse(localData) as LocalDataBase
        }
        return this.dataBase
    }

    // dataBase 访问器
    set storage(data: LocalDataBase) {
        // console.log('set 被访问', data)
        this.dataBase = data

        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(data))
    }

    /**
     * 查看是否存在本地信息
     *
     * @returns 是否存在信息
     */
    hasStorage(): boolean {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        return (typeof localData === 'string')
    }

    /**
     * 获取本地保存的原始数据文本
     *
     * @returns 字符串类型的原始数据，没有数据的话返回空字符串
     */
    getOriginStorage(): string {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        return (typeof localData === 'string') ? localData : ''
    }

    /**
     * 重设原始数据
     *
     * @param dataStr 要替换成的原始数据文本
     */
    saveOriginStorage(dataStr: string): void {
        localStorage.setItem(LOCAL_STORAGE_NAME, dataStr)
    }
}
