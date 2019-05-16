# webpackDemo
学习webpack

## 安装

全局安装

```javascript
npm install webpack webpack-cli -g
```

项目安装

```javascript
npm install webpack webpack-cli -D
```

不使用全局安装，使用 npx 查看项目的版本

```javascript
npx webpack -v
```



## 配置

在 webpack.config.js 文件中配置

```javascript
const path = require('path')

module.exports = {
  mode: 'production', // 打包格式，是否压缩
  entry: './src/index.js', // 入口文件
  output: { // 出口文件
    filename: 'bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
```

在 package.json 文件中为 scripts 添加

```javascript
"bundle": "webpack"
```

可以直接使用 npm run bundle 打包，手动命令为 npx webpack



## Loader

在 webpack.config.js 文件 module 中配置

使用各种不同的 loader 就可以让 webpack 支持各种资源的打包

```javascript
rules: [{
  test: /\.(png|svg|jpg|gif)$/, // 图片格式
  use: {
    loader: 'file-loader' // 使用file-loader支持打包图片
  }
}]
```

