const { CleanWebpackPlugin } = require('clean-webpack-plugin') // 引入
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过插件生成html模板
const path = require('path')

module.exports = {
  entry: { // 入口文件
    main: './src/index.js' // 文件名为main.js
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
        test: /\.js$/,
        exclude: /node_modules/, // 对node_modules中的JS进行忽略
        loader: 'babel-loader'
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
    }) // 指定html模板文件
  ],
  output: { // 出口文件
    filename: '[name].js', // 输出文件名
    path: path.resolve(__dirname, '../dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
