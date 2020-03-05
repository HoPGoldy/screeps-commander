// 本地保存数据位置的名称
// 所有的数据都会保存在已该字段为名称的对象中
export const LOCAL_STORAGE_NAME = 'screepsCommandStorage'

// 默认的 shard 名称
export const DEFAULT_SHARD_NAME = 'shard3'

// 默认添加的几个命令按钮
export const DEFAULT_COMMANDS: Command[] = [
    {
        title: '查看 tick 时间',
        shard: 'shard3',
        body: 'Game.time',
        param: []
    },
    {
        title: '查看 Creep 数量',
        shard: 'shard3',
        body: 'Object.keys(Game.creeps).length',
        param: []
    },
    {
        title: '查看指定房间 RCL',
        shard: 'shard3',
        body: 'Game.rooms.$0.controller.level',
        param: [
            {
                label: '查看房间',
                default: 'W1N1',
                match: '$0'
            }
        ]
    }
]
