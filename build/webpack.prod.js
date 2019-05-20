const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const prodConfig = {
  mode: 'production', // 打包环境，生产环境
  devtool: 'cheap-module-source-map' // 生产环境配置 production
}

module.exports = merge(commonConfig, prodConfig)
