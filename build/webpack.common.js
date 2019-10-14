const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过插件生成html模板
const path = require('path')
const merge = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')

const commonConfig = {
  entry: { // 入口文件
    main: './src/index.js' // 文件名为main.js
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 对node_modules中的JS进行忽略
        use: [{
          loader: 'babel-loader'
        }]
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
        test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体格式
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
    }) // 指定html模板文件
  ],
  optimization: {
    usedExports: true,
    splitChunks: { // 代码分割
      chunks: 'all', // initial同步代码分割 async异步代码分割 all全部代码分割
      minSize: 30000, // 超过30000字节才会进行打包
      minChunks: 1, // 打包后被chunk引用次数大于等于1，会单独打包成一个文件
      maxAsyncRequests: 5, // 最多分割5个文件
      maxInitialRequests: 3, // 入口文件引入的库最多分割3个文件
      automaticNameDelimiter: '~', // 代码连接符
      name: true, // vendors 和 default 起的名字有效
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 对node_modules中的文件进行打包
          priority: -10 // 优先级
        },
        default: { // 对不在node_modules中的文件进行打包
          priority: -20,
          reuseExistingChunk: true // 忽略已经打包过的共用代码,直接使用打包过的文件
        }
      }
    }
  },
  output: { // 出口文件
    path: path.resolve(__dirname, '../dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}
