const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过插件生成html模板
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入

const makePlugins = (configs) => {
  const plugins = [
    new CleanWebpackPlugin() // 自动清空输出文件
  ]
  Object.keys(configs.entry).forEach(item => {
    plugins.push(
      new HtmlWebpackPlugin({ // 指定html模板文件
        template: 'src/index.html',
        filename: `${item}.html`,
        chunks: ['vendors', item] // 指定引入文件
      })
    )
  })
  const files = fs.readdirSync(path.resolve(__dirname, '../dll'))
  files.forEach(file => {
    if (/.*\.dll\.js/.test(file)) {
      plugins.push(new AddAssetHtmlPlugin({ // 向html模板文件中添加打包后第三方库代码包
        filepath: path.resolve(__dirname, '../dll', file)
      }))
    }
    if (/.*\.manifest\.json/.test(file)) {
      // 如果第三方库代码包中包含该库，则使用代码包中代码，提升打包速度
      plugins.push(new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll', file)
      }))
    }
  })
  return plugins
}

const configs = {
  entry: { // 入口文件
    index: './src/index.js',
    list: './src/list.js'
  },
  output: { // 出口文件
    path: path.resolve(__dirname, '../dist') // 输出文件路径 __dirname为webpack.config当前文件
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 省略文件后缀，将按规则查找
    alias: { // 别名
      '@': path.resolve(__dirname, '../src/style')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 匹配js和jsx
        include: path.resolve(__dirname, '../src'), // 只检查src目录下文件，提升打包速度
        exclude: /node_modules/, // 对node_modules中的JS进行忽略
        use: ['babel-loader', 'eslint-loader']
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
  performance: false, // 忽略性能警告
  optimization: {
    usedExports: true,
    splitChunks: { // 代码分割
      chunks: 'all', // initial同步代码分割 async异步代码分割 all全部代码分割
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/, // 对node_modules中的文件进行打包
          priority: -10 // 优先级
        },
        default: { // 对本地文件进行打包
          name: 'default',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}

configs.plugins = makePlugins(configs)

module.exports = configs
