const merge = require('webpack-merge')
const commonConfig = require('./weboack.common')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const prodConfig = {
  mode: 'production', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换style-loader
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换style-loader
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // 打包css
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})] // css代码压缩
  },
  output: {
    filename: '[name].[contenthash].js', // 输出文件名
    chunkFilename: '[name].[contenthash].js', // 入口文件拆分后名字格式
  }
}

module.exports = merge(commonConfig, prodConfig) // 合并
