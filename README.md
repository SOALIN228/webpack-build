# webpack

学习 `webpack`笔记，但是因为webpack生态非常丰富，只记录一些常用配置，具体以**文档为准**

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



## entry 和 output

```javascript
const path = require('path')

module.exports = {
  entry: { // 入口文件
    main: main.js // 文件名为main.js
  },
  output: { // 出口文件
    // publicPath: 'http://cdn.com.cn', // 如果静态文件使用CDN，添加指定CDN路径
    filename: '[name].bundle.js', // 输出文件名
    chunkFilename: '[name].bundle.chunk.js', // 走splitChunks打包的文件命名
    path: path.resolve(__dirname, 'dist') // 输出文件路径 __dirname为webpack.config当前文件
  }
}
```



##  缓存 hash

代码上线后，如果更改代码内容，但是文件名不变的话，浏览器会从缓存中将老版本的文件取出，这就头疼了，还好 webpack 提拱了解决办法

hash：所有文件使用统一的hash，只要一个文件改变，hash就会改变，从而改变所有文件

chunkhash：不同chunk使用与之对应对应的hash，但是同chunk中只要一个文件改变，那么同chunk的其他文件也会改变，不够灵活

contenthash：根据文件的内容来生成hash，这样每一个文件都有独特的hash，只有内容改变，hash才会改变

```javascript
output: {
  filename: '[name].[contenthash].js',   
  chunkFilename: '[name].[contenthash].js'
}
```



## Source Map

代码出错显示的是打包后文件的位置，使用 source-map 即可显示源文件的出错位置

devtool 会自动帮我们把打包位置文件位置映射到源文件位置

五个关键字任意组合，配置适合我们项目的：

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



## 开发和生产环境

```bash
npm install webpack-merge -D
```

配置 webpack.dev.js 和 webpack.prod.js 两个文件，用于打包不同环境的配置，

因为很多配置既要在开发环境用到也要在生成环境中用到，所以将共有属性抽取出来，建一个 webpack.common.js

```javascript
const merge = require('webpack-merge') // 用于配置合并
const commonConfig = require('./webpack.common') // 引入通用文件

const devConfig = {
    /*...*/
}

module.exports = merge(commonConfig, devConfig) // 导出配置文件
```

或者通过NODE_ENV获取当前环境

```js
module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}
```



## 打包命令

在 package.json 文件中为 scripts 添加

```bash
"build": "webpack --config build/webpack.prod.js",
"dev": "webpack-dev-server --config build/webpack.dev.js",
"server": "live-server ./dist --port=8081",
"lint": "eslint --ext .js ./src"
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
      target: 'http://localhost:3000', // 路径重定向
      secure: false, // 支持https
      pathRewrite: { // 请求重定向 请求a接口相当于请求b接口
        'a.json': 'b.json'
      },
      changeOrigin: true, // 可以获取到origin 内容，防止被拦截
      historyApiFallback: true // 单页应用跳转路由，如果找不到将以页面形式打开
    }
  }
}
```



## tree shaking

只支持ES Module(静态)，只打包用到的文件，如：引入文件 math.js ，但是只使用了其中一个方法，默认情况下会全部都进行打包，但是配置了 tree shaking 只会打包用到的文件

**环境配置**

在 webpack.common.js 文件中添加下面代码

```javascript
optimization: { // 生产环境下会默认添加
  usedExports: true
}
```

**注:** 开发环境下还是会全部进行打包，但是会标记用到了哪些，生产环境则只打包用到的

**配置忽略**

如果要打包的文件都会进行输出，在 `package.json` 文件中添加 `"sideEffects":  false`

```json
"sideEffects":  false // 全部需要检测，没有导出的文件会被忽略

"sideEffects": ["*.css"] // 配置忽略,不进行检测
```



## 代码分割(codeSplit)

将代码都打包到一个文件，首屏会很慢，利用浏览器可以同时加载多个 JS 文件的特性，将代码进行分割，提高加载速度

**自己实现**

将类库代码如 `lodash` 和业务代码进行拆分，将`lodash`挂载到window上，实现全局访问，这样业务代码更新时，通过缓存来加载库代码，只更新的业务代码，提高加载速度

**通过webpack实现代码分割**

默认配置

```js
optimization: {
  splitChunks: { // 代码分割
    chunks: 'async', // initial同步 async异步 all全部
    minSize: 30000, // 超过30000字节才会进行打包
    minRemainingSize: 0,
    maxSize: 0,
    minChunks: 1, // 被chunk引用次数大于等于1，会根据cacheGroups拆分成一个文件（chunk）
    maxAsyncRequests: 6, // 最多分割6个文件
    maxInitialRequests: 4, // 入口文件引入的库最多分割4个文件
    automaticNameDelimiter: '~', // 代码连接符
    automaticNameMaxLength: 30,
    cacheGroups: { // 拆分规则
      vendors: {
        test: /[\\/]node_modules[\\/]/, // 对node_modules中的文件进行拆分
        priority: -10 // 优先级，如果找不到符合要求的规则，会根据优先级
      },
      default: {
        minChunks: 2, // 最少被引用两次，才进行拆分
        priority: -20,
        reuseExistingChunk: true // 已经拆分过的共用代码，直接使用
      }
    }
  }
}
```

异步加载方式

可以做懒加载，只有在用到的时候才会进行加载，做首屏优化，路由懒加载等

```bash
npm install @babel/plugin-syntax-dynamic-import -D
```

引入 babel 预编译文件,在 `.babelrc` 文件中添加下面代码

```json
"plugins": [
  "@babel/plugin-syntax-dynamic-import"
]
```

异步加载`lodash`，`webpackChunkName:"lodash"`  定义拆分后文件的名字，提高页面代码利用率，从而提高首屏家载速度（将需要操作才加载的代码拆分，已异步的方式加载）

```js
function getComponent () {
  return import(/* webpackChunkName:"lodash" */'lodash').then(({ default: _ }) => {
    let element = document.createElement('div')
    element.innerHTML = _.join(['a', 'd'], '-')
    return element
  })
}

// async await 方式
async function getComponent () {
  const { default: _ } = await import(/* webpackChunkName: "lodash" */'lodash')
  let element = document.createElement('div')
  element.innerHTML = _.join(['a', 'd'], '-')
  return element
}

document.addEventListener('click', () => {
  getComponent().then(e => {
    document.body.appendChild(e)
  })
})

```

因为上面代码大部分配置都是默认的，我们并不需要修改，只需要需改chunks

```javascript
optimization: {
  splitChunks: {
    chunks: 'all' // 同步异步方式都进行拆分
  }
}
```

通过使用异步来实现代码的加载，提高代码的利用率，但是这样每次加载新的页面速度会变慢，所以通过设置 webpackPrefetch: true  当页面带宽有剩余时，自动加载，提高新页面打开速度

```javascript
// click.js
function handleClick () {
  const element = document.createElement('div')
  element.innerHTML = 'sync loading'
  document.body.appendChild(element)
}

export default handleClick
```

```js
// index.js
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */'./click.js').then(({default: func}) => {
    func()
  })
})
```



## resolve

```js
resolve: {
  extensions: ['.js', '.jsx'], // 安装设置进行文件尾缀匹配
  alias: { // 全局变量
    '@': path.resolve(__dirname, '../src')
  }
}
```



## Loader

在 webpack.dev.js 文件 module 中配置

使用各种不同的 loader 就可以让 webpack 支持各种资源的打包

### 打包字体

```bash
npm install file-loader url-loader -D
```

url-loader 依赖 file-loader ，使用方法基本相同，区别是 url-loader 可以指定当文件小于设置参数时，使用base64打包

```javascript
{
  test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/, // 字体格式
  use: [{
    loader: 'url-loader',
    options: {
      name: '[name]_[hash].[ext]',
      outputPath: 'fonts/',
      limit: 10000
    }
  }]
}
```

### 打包图片

```javascript
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 图片格式
  use: [{
    loader: 'url-loader', // 使用url-loader打包图片
    options: {
      name: '[name]_[hash].[ext]', // 配置打包后的名字 ext为文件扩展名
      outputPath: 'img/', // 输出路径
      limit: 10000 // 图片大于1000b使用base64进行打包，减少http请求
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
    'style-loader', // css in js
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

### HTML模版

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

### 热更新 HMR

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

### CSS代码拆分和压缩

将css代码拆分打包到css文件中

```bash
npm install mini-css-extract-plugin -D
```

css代码压缩

```bash
npm install optimize-css-assets-webpack-plugin -D
```

js代码压缩

```bash
npm install terser-webpack-plugin -D
```

常用配置

```javascript
const TerserJSPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module: {
  rules: [
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
    chunkFilename: '[id].css' // 间接引入命名方式
  })
],
optimization: {
  minimizer: [
    new TerserJSPlugin({}),
    new OptimizeCSSAssetsPlugin({})
  ]
}
```

> 如果使用了 tree shaking，在 package.json 中添加忽略

### 自动引入

使用 jquery 等库文件要在每个 js 中都引用非常麻烦，可以通过webpack的原生插件，实现自动引入

```js
plugins: [
  new webpack.ProvidePlugin({
    $: 'jQuery', // 自动引入库 使用$时自动引入jquery
    _join: ['lodash', 'join'] //自动引入库中的方法 使用_join时自动引入lodash中的join
  })
]
```

### 目录拷贝

将单个文件或整个目录复制到构建目录

```bash
npm install copy-webpack-plugin -D
```

```js
new CopyWebpackPlugin([
  {
    from: path.resolve(__dirname, '../static'),
    to: 'static',
    ignore: ['.*']
  }
])
```



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



## ESLint

安装`eslint`

```bash
npm install eslint eslint-loader -D
```

`eslint` 文件初始化

```bash
npx eslint --init
```

对js文件进行检查，但是对降低打包速度

另一种方法是提交代码时做eslint检查，不通过拒绝提交代码，牺牲交互友好性，提高打包速度

```js
{
  test: /\.js$/,
  exclude: /node_modules/, // 对node_modules中的JS进行忽略
  use: ['babel-loader', 'eslint-loader'] // 先执行eslint 在执行babel
}
```

使用babel-eslint做解析器

```bash
npm install babel-eslint -D
```

```js
// .eslintrc.js
{
  parser: 'babel-eslint'
}
```

将eslint 错误显示在页面上

```js
devServer: {
  overlay: true,
}
```

`.editorconfig`: 使用文件中配置的规则，优先级会高于编译器的默认配置

`.eslintignore`：配置eslint忽略文件检查目录



## TypeScript

```bash
npm install ts-loader typescript -D
```

```js
module: {
  rules: [{
    test: /\.tsx$/,
    use: 'ts-loader',
    exclude: /node_modules/
  }]
}
```

还需要配置`tsconfig.json` 才可以正常使用

```js
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



## React

```bash
npm install react react-dom -S
```

安装react

```bash
npm install @babel/preset-react -D
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



## 性能优化

1. 使用新版的node、npm、yarn，提高打包速度
2. loader 中使用`exclude`和`include`,减少检查的代码数量和嵌套层数
3. plugins 中去除不必要的插件，提高打包速度
4. resolve 中配置不要过多，如：extensions 只配置逻辑文件 js、 jsx、 vue
5. 将使用到的第三方库文件单独打包，使用`add-asset-html-webpack-plugin`将打包后的第三方库文件添加到html模版中，使用`webpack`中的`DllPlugin` 生成第三方库的分析文件，使用`webpack`中的`DllReferencePlugin`执行分析文件，根据分析文件的映射结果实现，如果已经单独打包过，则直接使用打包的库文件，否则进行打包，这样就可以只打包一次库代码，从而提升打包速度
6. 控制包的大小
7. webpack 默认使用node的单进程打包，借助thread-loader等使用多进程打包
8. 根据项目配置合理的source Map
9. devServer 打包到内存中，速度更快
10. 开发环境中去除无用的插件



## webpack打包分析

生成打包的`json`文件

```bash
webpack --profile --json > stats.json
```

将json文件，传入[分析网站](http://webpack.github.io/analyse/)获取分析结果



## 打包一个library

```js
output: {
  /*...*/
  library: "MyLibrary", // 可以通过script 方式引入
  libraryTarget: "umd", // 支持import require 等引入方式
},
externals: 'lodash' // 将loadash 库忽略，不打包进项目中
```



## PWA

安装谷歌plugin

```bash
npm install workbox-webpack-plugin -D
```

配置PWA

```js
const WorkboxPlugin = require('workbox-webpack-plugin') // PWA

plugins: [
  new WorkboxPlugin.GenerateSW({
  	clientsClaim: true,
  	skipWaiting: true
  })
]
```

业务应用

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
