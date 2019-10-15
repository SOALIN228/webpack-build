console.log(123)
if ('serviceWorker' in navigator) { // 是否支持serviceWorker
  window.addEventListener('load', () => {
    // 打包后生成service-worker.js
    navigator.serviceWorker.register('./service-worker.js').then(registration => { // 开启成功，将页面缓存
      console.log('service-worker registed')
    }).catch(err => {
      console.log('service-worker registed error' + err)
    })
  })
}
