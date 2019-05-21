const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: { // 入口文件
    index: './src/index.js', // 生成文件为index.js
    // bundle: './src/bundle.js' // 可以生成多个js文件，名字为键名
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    filename: '[name].js', // 输出文件名
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
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader', // 打包css
            options: {
              importLoaders: 2, // 在调用当前loader(CSS)之前，要调用两个loader(postcss 和 sass)
              // modules: true // 模块化打包css
            }
          },
          'postcss-loader', // 支持插件
          'sass-loader', // 打包sass
        ]
      }, {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
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
    new HtmlWebpackPlugin({ template: 'src/index.html' }) // 指定html模板文件
  ],
  optimization: {
    splitChunks: { // 代码分割
      chunks: 'all', // initial同步 async异步 all全部
      minSize: 30000, // 超过30000字节才会进行打包
      minChunks: 1, // 引用次数大于等于1
      maxAsyncRequests: 5, // 最多分割5个文件
      maxInitialRequests: 3, // 入口文件引入的库最多分割3个文件
      automaticNameDelimiter: '~', // 代码连接符
      name: true, // vendors 和 default 起的名字有效
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 对node_modules中的文件进行打包
          priority: -10, // 优先级
          name: "vendors" // 将所有符合要求的文件打包到vendors文件中
        },
        default: { // 对不在node_modules中的文件进行打包
          priority: -20,
          reuseExistingChunk: true // 忽略已经打包过的共用代码
        }
      }
    }
  }
}
