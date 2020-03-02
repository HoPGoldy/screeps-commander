const resolve = require('path').resolve

module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    outputDir: 'docs',
    publicPath: './',
    chainWebpack: config => {
        config.resolve.alias
            .set('plugin', resolve(__dirname, './src/plugins'))
            .set('component', resolve(__dirname, './src/components'))
    }
}
