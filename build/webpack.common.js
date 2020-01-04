const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const configs = {
  entry: {
    main: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
            limit: 10240
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  optimization: {
    usedExports: true, // 开启tree shaking
    splitChunks: {
      chunks: 'all', // 默认为 async
      cacheGroups: {
        vendors: {
          name: 'vendors', // 将所有符合要求的文件打包成一个vendors文件
          test: /[\\/]node_modules[\\/]/, // 优先对node_modules中的文件进行打包
          priority: -10 // 优先级
        },
        default: { // 对不在node_modules中的文件进行打包
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true // 忽略已经打包过的共用代码
        }
      }
    }
  }
}
module.exports = configs
