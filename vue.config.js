const resolve = require('path').resolve
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StatsPlugin = require('stats-webpack-plugin')

module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    outputDir: 'docs',
    publicPath: './',
    configureWebpack: {
        plugins: [new StatsPlugin('stats.json', {
            chunkModules: true,
            chunks: true,
            assets: false,
            modules: true,
            children: true,
            chunksSort: true,
            assetsSort: true
        })]
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('plugin', resolve(__dirname, './src/plugins'))
            .set('component', resolve(__dirname, './src/components'))
    }
}
