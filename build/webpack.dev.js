const webpack = require('webpack')

const devConfig = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: false, // 打开文件路径
    open: true, // 自动打开页面
    port: 8080, // 指定端口号
    hot: true, // 开启热更新
    // hotOnly: true, // HMR失效也不刷新浏览器
    proxy: { // 跨域代理
      '/api': 'http://localhost:3000'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // 添加到head顶部
          {
            loader: 'css-loader', // 打包css
            options: {
              importLoaders: 2, // 在调用当前loader(CSS)之前，要调用两个loader(postcss 和 sass)
              modules: true // 模块化打包css
            }
          },
          'postcss-loader', // 支持插件
          'sass-loader' // 打包sass
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // HMR
  ],
  output: {
    filename: '[name].js', // 输出文件名
    chunkFilename: '[name].chunk.js', // 入口文件拆分后名字格式
  }
}

module.exports = devConfig
