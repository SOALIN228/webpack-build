# webpackDemo
学习webpack

## 安装

全局安装

```bash
npm install webpack webpack-cli -g
```

项目安装

```bash
npm install webpack webpack-cli -D
```

不使用全局安装，使用 npx 查看项目的版本

```bash
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

```bash
"bundle": "webpack"
```

可以直接使用 npm run bundle 打包，手动命令为 npx webpack



## Loader

在 webpack.config.js 文件 module 中配置

使用各种不同的 loader 就可以让 webpack 支持各种资源的打包



### 打包图片

```bash
npm install --save-dev file-loader url-loader
```

url-loader 和 file-loader 功能相似，区别是 url-loader 可以指定当图片小于设置参数时，使用base64打包

```javascript
{
  test: /\.(png|svg|jpg|gif)$/, // 图片格式
  use: [{
    loader: 'url-loader', // 使用url-loader打包图片
    options: {
      name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
      outputPath: 'images/', // 输出路径
      limit: 20480 // 图片大于2kb使用base64进行打包，减少http请求
    }
  }]
}
```



### 打包CSS

style-loader css-loader 支持打包 css

```bash
npm install style-loader css-loader -D
```

sass-loader 支持打包 sass

```bash
npm install sass-loader node-sass -D
```

**注**：安装 node-sass 可能会失败，我都换源了还是不行，难受，使用下面方法可以解决

```bash
npm i node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/ -D
```

postcss-loader 可以安装插件

```bash
npm i postcss-loader -D
```

安装自动生成厂商前缀插件

```bash
npm install autoprefixer -D
```

在 postcss.config.js 文件配置 autoprefixer

```javascript
module.exports = {
  plugins: [
    require('autoprefixer') // 自动生成厂商前缀
  ]
}
```

loader 配置, loaderd 打包从下到上调用 loader

```javascript
{
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
}
```



### 打包字体

file-loader 和 url-loader 都可以

```javascript
{
  test: /\.(woff|woff2|eot|ttf|otf)$/, // 字体格式
  use:[{
    loader: 'file-loader'
  }
```