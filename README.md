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

在 webpack.dev.js 文件中配置

```javascript
const path = require('path')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
  // devtool: 'cheap-module-source-map', // 生产环境配置 production
  entry: { // 入口文件
    main: './src/index.js', // 生成文件为main.js
    bundle.js
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

在 webpack.dev.js 文件 module 中配置

使用各种不同的 loader 就可以让 webpack 支持各种资源的打包

### 打包图片

```bash
npm install file-loader url-loader -D
```

url-loader 和 file-loader 功能相似，区别是 url-loader 可以指定当图片小于设置参数时，使用base64打包

**注**：file-loader url-loader 最好都安装，因为在打包 css中的图片时 url-loader 依赖 file-loader

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
  test: /\.scss$/,
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



## 添加热更新 HMR

在更改 CSS 代码或 JS 代码后，页面会自动刷新，但是我们不想页面刷新，而是将原内容替换为修改过的内容，配置 HMR 可以帮助我们解决这个问题，提升开发效率

```javascript
const webpack = require('webpack') // 引入

devServer: {
  /*...*/
  hot: true, // 开启热更新
  hotOnly: true // HMR失效也不刷新浏览器
}

plugins: [
  new webpack.HotModuleReplacementPlugin(), // HMR
  /*...*/
]
```

现在我们修改 CSS 文件就不会刷新页面，而且会热更新了

但是修改 JS 文件我们还要配置一点东西

```javascript
if (module.hot) { // 页面重新渲染时触发
  module.hot.accept('./number', () => { // 指定监听页面
      document.body.removeChild(document.getElementById('number')) // 移除原来的DOM
      number() // 重新添加DOM
  })
}
```

为什么修改 JS 要比修改 CSS 麻烦这么多，为什么 Vue 不需要写这些东西那，因为 style-loade 帮我们在 CSS 中做了上面那些事情，vue-loader 帮我们在 Vue 中做了上面那些事情



## babel

使用 babel 可以将我们的代码从 es6 或更高的版本，转换成低版本浏览器识别的 JS

```bash
npm install babel-loader @babel/core -D
```

添加 loader 和 核心模块

```bash
npm install @babel/preset-env -D
```

将代码转换成 es5

```bash
npm install @babel/polyfill core-js@3 --save
```

es6 中新增的对象或函数，只靠 preset-env 只能解决一部分，还需要添加 polyfill ，polyfill内部集成了(core-js)

注：使用'useBuiltIns': 'usage'不需要添加 `import "@babel/polyfill";` ,因为会自动加载

```javascript
{
  test: /\.js$/,
  exclude: /node_modules/, // 对node_modules中的JS进行忽略
  loader: 'babel-loader',
  options: {
    presets: [ // 插件集合
      [
        '@babel/preset-env',
        {
          targets: { // 指定兼容浏览器的版本
            edge: "17",
            firefox: "60",
            chrome: "67",
            safari: "11.1",
          },
          useBuiltIns: 'usage', // 按需转入，用到哪些新语法，就添加哪些
          corejs: 3 // 指定版本,不写会报错，坑
        }
      ]
    ]
  }
}
```

如果配置的 babel 属性很多可以新建一个名为 `.babelrc` 的文件，专门存放关于 babel 的配置(json格式，双引号)

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

polyfill 依赖全局环境，会造成污染，如果自己写组件库，使用plugin-transform-runtime, 以闭包的形式注入，不污染全局属性

```bash
npm install @babel/plugin-transform-runtime -D
```

```bash
npm install @babel/runtime --save
```

```bash
npm install @babel/runtime-corejs3  --save
```

```javascript
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

plugins 同样可以配置到 `.babelrc` 中



## tree shaking

只打包用到的文件，如：引入文件 main.js ，但是只使用了其中一个方法，默认情况下会全部都进行打包，但是配置了 tree shaking 只会打包用到的文件

**开发环境配置**

在 webpack.dev.js 文件中添加下面代码

```javascript
optimization: {
  usedExports: true
}
```

**注：**开发环境下还是会全部进行打包，但是会标记用到了哪些，生产环境则只打包用到的

**生产环境配置**

只需要指定 `mode: 'production'`  即可

**配置忽略**

如果要打包的文件都会进行输出，在 package.json 文件中添加 "sideEffects":  false 即可，但是更多的情况我们需要配置忽略，将他们写入数组中：如："@babel/polly-fill"，"*.css" 等



## 开发和生成环境代码分离

```bash
npm install webpack-merge -D
```

用于通用配置

将 webpack.config.js 分解成 webpack.dev.js 和 webpack.prod.js 两个配置文件，用于打包不同环境的配置，

因为很多配置既要在开发环境用到也要在生成环境中用到，所以将共有属性抽取出来，建一个 webpack.common.js 

```javascript
const merge = require('webpack-merge') // 用于通用配置
const commonConfig = require('./webpack.common') // 引入通用文件

const devConfig = {
    /*...*/
}

module.exports = merge(commonConfig, devConfig) // 导出配置文件
```

在 package.json 中更改开发和生产环境的命令

```json
"dev": "webpack-dev-server --config build/webpack.dev.js",
"bundle": "webpack --config build/webpack.prod.js"
```