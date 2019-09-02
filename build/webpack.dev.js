const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./weboack.common')

const devConfig = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist', // 打开文件路径
    open: true, // 自动打开页面
    port: 8080, // 指定端口号
    hot: true, // 开启热更新
    // hotOnly: true, // HMR失效也不刷新浏览器
    proxy: { // 跨域代理
      '/api': 'http://localhost:3000'
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // HMR
  ],
  optimization: { // tree shaking
    usedExports: true
  }
}

module.exports = merge(commonConfig, devConfig) // 合并
