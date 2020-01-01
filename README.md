# webpackDemo

学习 `webpack`，具体以**文档为准**，不会就**查文档、查文档、查文档**

`webpack` 是一个模块打包工具

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



## 配置entry和output

在 webpack.dev.js 文件中配置

```javascript
const path = require('path')

module.exports = {
  mode: 'development', // 打包环境，开发还是生产(development or production)
  devtool: 'cheap-module-eval-source-map', // 开发环境配置 development
  // devtool: 'cheap-module-source-map', // 生产环境配置 production
  entry: { // 入口文件
    main: main.js // 文件名为main.js
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    filename: '[name].bundle.js', // 输出文件名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
```



## Source Map

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



## 打包命令

在 package.json 文件中为 scripts 添加

```bash
"build": "webpack",
"dev": "webpack-dev-server",
"server": "live-server ./dist --port=8081"
```



## devServer

开启一份服务，将项目打包好运行在内存中，监听文件变动，自动进行**打包**和**页面刷新**，大大提高开发效率

```bash
npm install webpack-dev-server -D
```

常用配置

```javascript
devServer: {
  contentBase: path.resolve(__dirname, '../dist'), // 打开文件路径
  open: true, // 自动打开页面
  port: 8080, // 指定端口号
  // host: '0.0.0.0', // 开启IP访问模式
  hot: true, // 开启热更新
  hotOnly: true, // HMR失效也不刷新浏览器
  proxy: { // 跨域代理
    '/api': {
      target: 'http://localhost:3000', // 路径重定型
      pathRewrite: { // 请求header 被重定向为demo
        'header.json': 'demo.json'
      },
      changeOrigin: true, // 可以获取到origin 内容，最好一直设置
      historyApiFallback: true // 单页应用跳转路由，默认以接口形式打开，配置后如果找不到将以页面形式打开
    }
  }
}
```



## Loader

在 webpack.dev.js 文件 module 中配置

使用各种不同的 loader 就可以让 webpack 支持各种资源的打包

### 打包字体

```bash
npm install file-loader -D
```

打包配置

```javascript
{
  test: /\.(woff2?|eot|ttf|otf|svg)$/, // 字体格式
  use: [{
    loader: 'file-loader',
    options: {
      name: '[name]_[hash].[ext]',
      outputPath: 'fonts/'
    }
  }]
}
```

### 打包图片

```bash
npm install url-loader -D
```

url-loader 和 file-loader 功能相似，区别是 url-loader 可以指定当图片小于设置参数时，使用base64打包

```javascript
{
  test: /\.(jpe?g|png|gif)$/, // 图片格式
  use: [{
    loader: 'url-loader', // 使用url-loader打包图片
    options: {
      name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
      outputPath: 'images/', // 输出路径
      limit: 20480 // 图片大于20kb使用base64进行打包，减少http请求
    }
  }]
}
```

> url-loader 依赖 file-loader

### 打包CSS

style-loader css-loader 支持打包 css

```bash
npm install style-loader css-loader -D
```

sass-loader 支持打包 sass

```bash
npm install sass-loader node-sass -D
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

loader 打包是从下到上逐层调用 loader

```javascript
{
  test: /\.scss$/,
  use: [
    'style-loader', // 添加到head顶部
    {
      loader: 'css-loader', // 打包css
      options: {
        importLoaders: 2, // 在调用当前loader(CSS)之前，要调用两个loader(postcss 和 sass)
        // modules: true // 模块化打包css
      }
    },
    'postcss-loader', // 支持插件
    'sass-loader' // 打包sass
  ]
}
```



## Plugins

插件，扩展 webpack 的功能

### 配置HTML模版

配置html模版，并将打包后的js引入到模版中

```bash
npm install html-webpack-plugin -D
```

每次打包前自动清空dist文件中的无效文件

```bash
npm install clean-webpack-plugin -D
```

```javascript
const { CleanWebpackPlugin } = require("clean-webpack-plugin") // 引入
const HtmlWebpackPlugin = require('html-webpack-plugin') // 通过插件生成html模板

plugins: [
  new CleanWebpackPlugin(), // 自动清空输出文件
  new HtmlWebpackPlugin({ template: 'src/index.html' }) // 指定html模板文件
]
```

### 添加热更新 HMR

HMR只做修改内容部分的更新，而不是通过刷新页面达到更新，可以大大提高开发效率

配置 CSS 文件热更新

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

但是修改 JS 文件需要自己配置如何替换DOM，从而实现HMR

```javascript
if (module.hot) { // 页面重新渲染时触发
  module.hot.accept('./number', () => { // 指定监听页面
      document.body.removeChild(document.getElementById('number')) // 移除原来的DOM
      number() // 重新添加DOM
  })
}
```

> 原因是 style-loade 中实现了CSS文件中类似的替换，vue-loader 中实现了 Vue 中类似的替换

## babel

使用 babel 可以将我们的代码从 es6 或更高的版本，转换成低版本浏览器识别的 JS

添加 loader 和 核心模块

```bash
npm install babel-loader @babel/core -D
```

将代码转换成 es5

```bash
npm install @babel/preset-env -D
```

实现浏览器不支持的js语法

```bash
npm install core-js regenerator-runtime -S
```

注：使用'useBuiltIns': 'usage'不需要添加 `import "@babel/polyfill";` ,因为会自动加载

```javascript
{
   test: /\.js$/,
   exclude: /node_modules/, // 对node_modules中的JS进行忽略
   loader: "babel-loader"
}
```

 `.babelrc`  babel 的配置文件

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ]
}
```

`.browserslistrc` 指定babel打包好支持的浏览器

全球大于1%使用的版本，支持每个浏览器的最后两个版本，如过不考虑ie，可以再格外配置，减少打包后的体积

```
> 1%
last 2 versions
```

`polyfill` 依赖全局环境，会造成污染，如果业务代码，无需考虑

如果是库代码，使用 `plugin-transform-runtime`和`runtime`, 以闭包的形式注入，不污染全局属性

```bash
npm install @babel/plugin-transform-runtime -D
```

```bash
npm install @babel/runtime -S
```

```javascript
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```



## React

```bash
npm install react react-dom --save
```

安装react

```bash
npm install --save-dev @babel/preset-react
```

安装`preset-react`解析react

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    [
      "@babel/preset-react"
    ]
  ]
}
```



## tree shaking

只支持ES Module(静态)，只打包用到的文件，如：引入文件 math.js ，但是只使用了其中一个方法，默认情况下会全部都进行打包，但是配置了 tree shaking 只会打包用到的文件

**环境配置**

在 webpack.common.js 文件中添加下面代码

```javascript
optimization: { // 开发环境可以省略不写，会默认添加
  usedExports: true
}
```

**注:** 开发环境下还是会全部进行打包，但是会标记用到了哪些，生产环境则只打包用到的

**生产环境配置**

只需要指定 `mode: 'production'`  即可

**配置忽略**

如果要打包的文件都会进行输出，在 `package.json` 文件中添加 `"sideEffects":  false`

```json
"sideEffects":  false // 全部需要检测，没有导出的文件会被忽略

"sideEffects": ["@babel/polly-fill","*.css"] // 配置忽略,不进行检测
```



## 开发和生产环境代码分离

```bash
npm install webpack-merge -D
```

用于通用配置

将 webpack.dev.js 分解成 webpack.dev.js 和 webpack.prod.js 两个配置文件，用于打包不同环境的配置，

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
"build": "webpack --config build/webpack.prod.js"
```



## 代码分割

将代码都打包到一个文件，首屏会很慢，所以利用浏览器可以同时加载多个 JS 文件，将代码分割

**同步方式**

- 自己实现

将类库代码如 `lodash` 和业务代码进行拆分，在`lodash`文件中将其挂载到window上，实现全局访问，这样业务代码更新时，可以通过缓存来加载 `lodash` 只请求更新的业务代码

- 通过webpack自动实现代码分割

  根据代码进行自动分割

  ```js
  optimization: {
    splitChunks: {
      chunks: 'all' // 默认为 async
    }
  }
  ```

**异步方式**

可以做懒加载，只有在用到的时候才会进行加载(首屏优化，进行代码分割，路由懒加载，用到的时候才会加载)

```bash
npm install @babel/plugin-syntax-dynamic-import -D
```

引入 babel 预编译文件,在 `.babelrc` 文件中添加下面代码

```json
"plugins": [
  "@babel/plugin-syntax-dynamic-import"
]
```

异步加载`lodash`

```js
function getComponent () {
  return import('lodash').then(({ default: _ }) => {
    let element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], '-')
    return element
  })
}

getComponent().then(element => {
  document.body.append(element)
})
```

`webpackChunkName:"lodash"`  定义打包后文件的名字

```javascript
function getComponent () {
  return import(/* webpackChunkName:"lodash" */'lodash').then(({ default: _ }) => {
    ...
  })
}
```

webpack 中添加如下代码

```javascript
optimization: {
  splitChunks: { // 代码分割
    chunks: 'all', // initial同步 async异步 all全部
    minSize: 30000, // 超过30000字节才会进行打包
    minChunks: 1, // 打包后被chunk引用次数大于等于1，会单独打包成一个文件
    maxAsyncRequests: 5, // 最多分割5个文件
    maxInitialRequests: 3, // 入口文件引入的库最多分割3个文件
    automaticNameDelimiter: '~', // 代码连接符
    name: true, // vendors 和 default 起的名字有效
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/, // 对node_modules中的文件进行打包
        priority: -10, // 优先级
        name: "vendors" // 将所有符合要求的文件打包成一个vendors文件
      },
      default: { // 对不在node_modules中的文件进行打包
        priority: -20,
        reuseExistingChunk: true, // 忽略已经打包过的共用代码
        name: 'common'
      }
    }
  }
}
```

因为上面代码大部分配置都是默认的，我们并不需要修改，所以可以省略，由 webpack 来加载默认配置

```javascript
optimization: {
  splitChunks: {
    chunks: 'all' // 默认为 async
  }
}
```

通过使用异步来实现代码的加载，提高代码的利用率，但是这样每次加载新的页面速度会变慢，所以通过设置 webpackPrefetch: true  当页面带宽有剩余时，自动加载，提高性能

```javascript
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './click.js').then(({default: func}) => {
    func()
  })
})
```

指定入口文件拆分后名字格式

```js
output: { // 出口文件
  chunkFilename: '[name].chunk.js', // 入口文件拆分后名字格式
}
```

## webpack打包分析

生成打包的`json`文件

```bash
webpack --profile --json > stats.json
```

将json文件，传入[分析网站](http://webpack.github.io/analyse/)获取分析结果


## CSS代码拆分

将css代码拆分打包到css文件中

```bash
npm install mini-css-extract-plugin -D
```

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
]
```

```bash
npm install optimize-css-assets-webpack-plugin -D
```

添加css代码压缩

```javascript
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

optimization: {
  minimizer: [new OptimizeCSSAssetsPlugin({})] // css代码压缩
}
```

注：如果使用了 tree shaking，在 package.json 中添加忽略

```json
"sideEffects": [
  "@babel/polly-fill",
  "*.css"
],
```



## 配置 hash 用于缓存

代码上线后，如果更改代码内容，但是文件名不变的话，浏览器会从缓存中将老版本的文件取出，这就头疼了，还好 webpack 提拱了解决办法

```javascript
output: {
  filename: '[name].[contenthash].js', // 输出文件名使用hash
  chunkFilename: '[name].[contenthash].js' // 通过html中js引入的js
}
```

这样每个文件都有了一个独特的 hash 值，如果我们改变文件内容 hash 会改变，否则不变

CSS 也是一样

```javascript
plugins: [
  new MiniCssExtractPlugin({ // 打包css
    filename: '[name].[contenthash].css', // 配置hash
    chunkFilename: '[id].[contenthash].css'
  })
]
```

**注：**webpack 老版本可能处理起 hash 会有问题，所以添加下面代码，将hash管理单独成一个文件就ok了，**新版本无视**

```javascript
optimization: {
  runtimeChunk: { // 将hash关联分离出来
    name: 'runtime'
  }
}
```



## 自动引入

使用 jquery 等库文件要在每个 js 中都引用非常麻烦，可以通过配置，自动引入

```js
plugins: [
  new webpack.ProvidePlugin({
    $: 'jQuery', // 自动引入jquery
    _join: ['lodash', 'join'] // 使用_join时自动引入lodash中的join
  })
]
```

**指定 this 的 loader**

每个js文件的this默认执行自己，可以通过imports-loader修改默认this，但也可以通过call来指定this

```bash
npm install imports-loader -D
```

```javascript
{
  test: /\.js$/,
    exclude: /node_modules/, // 对node_modules中的JS进行忽略
    use: [{
      loader: 'babel-loader'
    }, {
      loader: 'imports-loader?this=>window' // 将默认this改为window
    }]
}
```

## 另一种环境配置的方法

在`webpack.common.js`中根据环境进行输出

```js
module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}
```

## 打包一个library

```js
output: {
  library: "MyLibrary", // 可以通过script 方式引入
  libraryTarget: "umd", // 支持import require 等引入方式
},
externals: 'lodash' // 将loadash 库忽略，不打包进项目中
```

## PWA

```bash
npm install workbox-webpack-plugin -D
```

安装谷歌plugin

```js
const WorkboxPlugin = require('workbox-webpack-plugin') // PWA

plugins: [
  new WorkboxPlugin.GenerateSW({
  	clientsClaim: true,
  	skipWaiting: true
  })
]
```

配置PWA

```js
// index.js
if ('serviceWorker' in navigator) { // 是否支持serviceWorker
  window.addEventListener('load', () => {
    // 打包后生成service-worker.js
    navigator.serviceWorker.register('./service-worker.js')
    .then(registration => { // 开启成功，将页面缓存
      console.log('service-worker registed')
    }).catch(error => {
      console.log('service-worker registed error')
    })
  })
}
```

业务应用

## TypeScript

```bash
npm install ts-loader typescript -D
```

```js
module: {
  rules: [{
    test: /\.tsx/,
    use: 'ts-loader',
    exclude: /node_modules/
  }]
}
```

还需要配置`tsconfig.json` 才可以正常使用

```json
{
  "compilerOptions": {
    "outDir": "./dist", // 输出文件路径
    "module": "es6", // 设置在ts 文件中支持es6 写法
    "target": "es5", // 打包生成es5
    "allowJs": true // 页面中支持js 文件的引入
  }
}
```

使用`lodash` 库需要添加类型支持库文件，格式为`@types/xxx`

```bash
npm install @types/lodash -D
```

**添加ts 类支持后要使用 * as 写法**

```js
import * as _ from 'lodash'
```

## EsLint

```bash
npm install eslint eslint-lader -D
```

安装`eslint`

```bash
npx eslint --init
```

`eslint` 文件初始化

选择 `standard` 的规范

```js
{
  test: /\.js$/,
  exclude: /node_modules/, // 对node_modules中的JS进行忽略
  use: ['babel-loader', 'eslint-loader'] // 先执行eslint 在执行babel
}
```

```bash
npm install babel-eslint -D
```

```js
// .eslintrc.js
parserOptions: { // 使用babel-eslint 做编译器
  parser: 'babel-eslint'
}
```

```js
devServer: {
  overlay: true, // 将eslint 错误显示在页面上
}
```

设置`.editorconfig`

优先级会高于编译器的默认配置，如果无效将编译器的查找文件删掉，再次生成就会读取了

## 性能优化

1. 使用`exclude`和`include`,减少`loader`检查的代码数量和嵌套层数
2. 去除不必要的`plugins`
3. 减少`resolve`中不必要的配置，如：`extensions`后缀的数量不要过多
4. 将使用到的第三方库文件单独打包，使用`add-asset-html-webpack-plugin`将第三方库文件添加到html模板文件中，使用`webpack`中的`DllPlugin` 生成第三方代码库的分析文件，使用`webpack`中的`DllReferencePlugin`执行分析文件，如果已经打包过，则直接使用打包的库文件，这样只会打包一次，提升打包速度
