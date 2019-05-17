# webpackDemo
学习webpack，具体以**文档为准**，不会就**查文档、查文档、查文档**

## 安装

全局安装

```bash
npm install webpack webpack-cli -g
```

项目安装

```bash
npm install webpack webpack-cli -D
```

不使用全局安装，使用 **npx** 查看项目的版本

```bash
npx webpack -v
```



## 配置 entry 和 output

在 webpack.config.js 文件中配置

```javascript
const path = require('path')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
  // devtool: 'cheap-module-source-map', // 生产环境配置 production
  entry: { // 入口文件
    main: './src/index.js', // 生成文件为main.js
    // bundle: './src/bundle.js' // 可以生成多个js文件，名字为键名
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    filename: '[name].js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
```



### devtool

因为代码出错显示的是打包后文件的位置，使用 devtool 配置 source-map 即可显示源文件的出错位置，devtool 会自动帮我们把打包位置文件位置映射到源文件位置

五个关键字任意组合，配饰适合我们项目的：

- eval： 使用 eval 包裹模块代码，也不会产生单独的`.map`
- source-map： 产生`.map`文件(映射)
- cheap： 不包含列信息(只显示报错的行信息，打包速度会快一点)
- module： 包含 loader 的 sourcemap
- inline： 将`.map`作为DataURI嵌入到打包文件中，不单独生成`.map`文件

**推荐配置**：

```bash
devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
devtool: 'cheap-module-source-map', // 生产环境配置 production
```



### 打包命令

在 package.json 文件中为 scripts 添加

```bash
"bundle": "webpack"
```

可以直接使用 **npm run bundle** 打包，手动命令为 **npx webpack**



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
  use: [{
    loader: 'file-loader'
  }]
}
```



## Plugins

帮助 webpack 运行到某个时刻时，帮我做一些事情

```bash
npm install html-webpack-plugin -D
```

打包后生成 index.html 文件，并自动将打包的 JS 引入到 index.html 文件中

```bash
npm install clean-webpack-plugin -D
```

自动清空输出文件中的无效文件

```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin') // 引入
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new CleanWebpackPlugin(), // 自动清空输出文件,
  new HtmlWebpackPlugin({ template: 'src/index.html' }) // 指定html模板文件
]
```



## devServer

监听我们文件，更改后自动帮我们进行打包和页面刷新，适合开发中使用，还有很多非常nice的配置

```bash
npm install webpack-dev-server -D
```

安装

```bash
"start": "webpack-dev-server"
```

在 package.json 文件中添加命命令，使用 **npm run start** 启动

```javascript
devServer: {
  contentBase: './dist', // 打开文件路径
  open: true, // 自动打开页面
  port: 8080, // 指定端口号
  proxy: { // 跨域代理
    "/api": "http://localhost:3000"
  }
}
```