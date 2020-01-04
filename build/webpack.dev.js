const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    port: 8080,
    // host: '0.0.0.0', // 开启IP访问模式
    hot: true, // 开启热更新
    hotOnly: true, // HMR失效也不刷新浏览器
    overlay: true, // 将eslint 错误显示在页面上
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 路径重定向
        secure: false, // 支持https
        pathRewrite: { // 请求重定向 请求a接口相当于请求b接口
          'a.json': 'b.json'
        },
        changeOrigin: true, // 可以获取到origin 内容，防止被拦截
        historyApiFallback: true // 单页应用跳转路由，如果找不到将以页面形式打开
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // modules: true // 模块化打包css
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = merge(commonConfig, devConfig)
