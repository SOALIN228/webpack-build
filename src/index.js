import th from './th.jpg'
import './index.scss'

var img = new Image()
img.src = th
img.classList.add('avatar')

var root = document.getElementById('root')
root.append(img)
