const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: { // 要打包的第三方库
    lodash: ['lodash'],
    react: ['react', 'react-dom']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]' // 生成库代码
  },
  plugins: [
    new webpack.DllPlugin({ // 生成第三方库代码分析文件
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}
