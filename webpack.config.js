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
      test: /\.(png|svg|jpg|gif)$/, // 图片格式
      use: {
        loader: 'url-loader', // 使用url-loader打包图片
        options: {
          name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
          outputPath: 'images/', // 输出路径
          limit: 20480
        }
      }
    }]
  }
}
