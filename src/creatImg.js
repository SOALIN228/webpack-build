import bgImg from './bgImg.jpg'
import style from './index.scss'

function creatImg() {
  let img = new Image()
  img.src = bgImg
  img.classList.add(style.bgImg)

  let root = document.getElementById('root')
  root.append(img)
}

export default creatImg
