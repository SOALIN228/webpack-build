import './style.css'
import _ from 'lodash'

const dom = document.createElement('div')
dom.innerHTML = _.join(['div', '1'], '1231')
document.body.appendChild(dom)
