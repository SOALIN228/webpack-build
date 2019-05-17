const path = require('path')

module.exports = {
  mode: 'production', // 打包格式，是否压缩
  entry: './src/index.js', // 入口文件
  output: { // 出口文件
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  },
  module: {
    rules: [{
      test: /\.(css|scss)$/,
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
      use:[{
        loader: 'file-loader'
      }]
    }
    ]
  }
}
