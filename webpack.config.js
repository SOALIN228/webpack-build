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
        loader: 'file-loader' // 使用file-loader打包图片
      }
    }]
  }
}
