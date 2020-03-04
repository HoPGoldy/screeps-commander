import { Component, Vue } from 'vue-property-decorator'
import { LOCAL_STORAGE_NAME, DEFAULT_SHARD_NAME } from '@/config'

@Component
export default class StorageApi extends Vue {
    // 所有应用数据都保存在该对象中
    dataBase!: LocalDataBase

    // dataBase 的访问器
    get storage(): LocalDataBase {
        // 本地没发现存储就进行初始化
        if (!this.dataBase) this.initStorage()

        return this.dataBase
    }

    // dataBase 访问器
    set storage(data: LocalDataBase) {
        // console.log('set 被访问', data)
        this.dataBase = data
        this.save()
    }

    initStorage() {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        // 如果本地没有存储的话就进行初始化工作
        if (!localData) {
            this.dataBase = {
                shard: DEFAULT_SHARD_NAME,
                commands: []
            }

            // 保存到本地
            this.save()
        }
        // 有本地存储的话就将其实例化
        else this.dataBase = JSON.parse(localData) as LocalDataBase

        console.log('初始化存储!', this.dataBase)
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

    /**
     * 保存新的按钮
     *
     * @param command 新的按钮数据
     */
    addNewCommand(command: Command) {
        console.log(this.dataBase)
        this.dataBase.commands.push(command)
        this.save()
    }

    /**
     * 将当前数据存档到 localStorage
     */
    save() {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(this.dataBase))
    }
}
