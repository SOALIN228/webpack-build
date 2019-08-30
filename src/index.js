import th from './th.jpg'
// import style from './index.scss'
import './index.scss'

var img = new Image()
img.src = th
img.classList.add('avatar') // 全局打包
// img.classList.add(style.avatar) // 模块打包

var root = document.getElementById('root')
root.append(img)

// 使用字体图标文件
// var root = document.getElementById('root')
// root.innerHTML = '<div class="iconfont icon-check-circle"></div>'
