const path = require('path')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  entry: { // 入口文件
    main: './src/index.js' // 文件名为main.js
  },
  output: { // 出口文件
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
