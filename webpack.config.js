const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过插件生成html模板
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map',
  entry: { // 入口文件
    main: './src/index.js' // 文件名为main.js
  },
  devServer: {
    contentBase: './dist', // 打开文件路径
    open: true, // 自动打开页面
    port: 8080, // 指定端口号
    hot: true, // 开启热更新
    hotOnly: true, // HMR失效也不刷新浏览器
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
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
            outputPath: 'images/', // 输出路径
            limit: 20480 // 图片大于2kb使用base64进行打包，减少http请求
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|svg|ttf|otf)$/, // 字体格式
        use: [{
          loader: 'file-loader'
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 自动清空输出文件
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }), // 指定html模板文件
    new webpack.HotModuleReplacementPlugin() // HMR
  ],
  output: { // 出口文件
    filename: '[name].bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
