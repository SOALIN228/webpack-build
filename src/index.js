import bgImg from './bgImg.jpg'
import './index.scss'

let img = new Image()
img.src = bgImg
img.classList.add('bgImg')

let root = document.getElementById('root')
root.append(img)
