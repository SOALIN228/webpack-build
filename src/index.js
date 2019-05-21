function getComponent () {
  return import(/* webpackChunkName:"lodash" */'lodash').then(_ => {
    let element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], '-')
    return element
  })
}

getComponent().then(element => {
  document.body.append(element)
})

