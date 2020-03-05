/**
 * 应用存储实现
 *
 * 该文件默认导出的对象即为应用存储
 * 所有和存储有关的操作都应通过调用本实现完成
 * 一般来说这里应该用 vuex 实现，但是我感觉这个体量的应用用不到 vuex
 *
 * - 在应用加载时需要调用 .init() 来完成初始化
 * - 在获取存储数据时应访问 .get()
 * - 在保存数据时应通过对应方法（如 .addNewButton ）来完成
 */

import { Component, Vue } from 'vue-property-decorator'
import { LOCAL_STORAGE_NAME, DEFAULT_SHARD_NAME, DEFAULT_COMMANDS } from '@/config'

@Component
class Storage extends Vue {
    // 所有应用数据都保存在该对象中
    private dataBase!: LocalDataBase

    /**
     * [重要] 初始化存储
     * 本方法应在程序加载时调用
     */
    init() {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        // 如果本地没有存储的话就进行初始化工作
        if (!localData) {
            this.dataBase = {
                shard: DEFAULT_SHARD_NAME,
                commands: DEFAULT_COMMANDS
            }

            // 保存到本地
            this.save()
        }
        // 有本地存储的话就将其实例化
        else this.dataBase = JSON.parse(localData) as LocalDataBase
    }

    /**
     * 存储的访问方式
     * 不允许直接访问 dataBase，防止出现违法操作
     */
    get() {
        return this.dataBase
    }

    /**
     * 查看是否存在本地信息
     *
     * @returns 是否存在信息
     */
    get exist() {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        return (typeof localData === 'string')
    }

    /**
     * 获取本地保存的原始数据文本
     *
     * @returns 字符串类型的原始数据，没有数据的话返回空字符串
     */
    getOrigin(): string {
        const localData = localStorage.getItem(LOCAL_STORAGE_NAME)

        return (typeof localData === 'string') ? localData : ''
    }

    /**
     * 重设原始数据
     *
     * @param dataStr 要替换成的原始数据文本
     */
    saveOrigin(dataStr: string): void {
        localStorage.setItem(LOCAL_STORAGE_NAME, dataStr)

        this.init()
    }

    /**
     * 保存新的按钮
     *
     * @param command 新的按钮数据
     */
    addNewCommand(command: Command) {
        this.dataBase.commands.push(command)
        this.save()
    }

    /**
     * 更新命令按钮
     *
     * @param index 要更新的命令索引
     * @param command 要更新成的命令数据
     */
    updateCommand(index: number, command: Command) {
        if (index >= this.dataBase.commands.length) return

        this.dataBase.commands[index] = command
        this.save()
    }

    /**
     * 移除指定命令
     *
     * @param index 要移除的 command 索引
     */
    removeCommand(index: number) {
        this.dataBase.commands.splice(index, 1)

        this.save()
    }

    /**
     * 设置新的 shard
     *
     * @param shard 要设置成的 shard 名称
     */
    setShard(shard: string) {
        this.dataBase.shard = shard

        this.save()
    }

    /**
     * 将当前数据存档到 localStorage
     */
    save() {
        localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(this.dataBase))
    }
}

export default new Storage()
