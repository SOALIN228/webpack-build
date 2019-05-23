const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { // 入口文件
    main: './src/main.js', // 生成文件为main.js
    // bundle: './src/bundle.js' // 可以生成多个js文件，名字为键名
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    path: path.resolve(__dirname, '../dist') // 输出文件路径 __dirname为webpack.config当前文件
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      }, {
        test: /\.js$/,
        exclude: /node_modules/, // 对node_modules中的JS进行忽略
        use: [{
          loader: 'babel-loader'
        }, {
          loader: 'imports-loader?this=>window' // 将默认this改为window
        }]
      }, {
        test: /\.(png|svg|jpg|gif)$/, // 图片格式
        use: [{
          loader: 'url-loader', // 使用url-loader打包图片
          options: {
            name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
            outputPath: 'images/', // 输出路径
            limit: 20480 // 图片大于2kb使用base64进行打包，减少http请求
          }
        }]
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体格式
        use: [{
          loader: 'file-loader'
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 自动清空输出文件,
    new HtmlWebpackPlugin({ template: 'src/index.html' }), // 指定html模板文件
    new webpack.ProvidePlugin({
      $: 'jQuery', // 自动引入jquery
      _join: ['lodash', 'join'] // 使用_join时自动引入lodash中的join
    })
  ],
  performance: false, // 忽略性能问题警告
  optimization: {
    usedExports: true, // 按需打包
    splitChunks: { // 代码分割
      chunks: 'all', // initial同步 async异步 all全部
    }
  }
}