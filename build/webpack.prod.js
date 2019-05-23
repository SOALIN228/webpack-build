const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')

const prodConfig = {
  mode: 'production', // 打包环境，生产环境
  devtool: 'cheap-module-source-map', // 生产环境配置 production
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ // 打包css
      filename: '[name].[contenthash].css', // 添加hash
      chunkFilename: '[id].[contenthash].css' // 添加hash
    })
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})] // css代码压缩
  },
  output: {
    filename: '[name].[contenthash].js', // 输出文件名使用hash
    chunkFilename: '[name].[contenthash].js' // 通过html中js引入的js
  }
}

module.exports = merge(commonConfig, prodConfig)
