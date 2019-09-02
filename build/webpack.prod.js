const merge = require('webpack-merge')
const commonConfig = require('./weboack.common')

const prodConfig = {
  mode: 'production', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-source-map'
}

module.exports = merge(commonConfig, prodConfig) // 合并
