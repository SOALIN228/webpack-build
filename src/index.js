// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react'
import ReactDom from 'react-dom'
import _ from 'lodash'

// eslint-disable-next-line no-unused-vars
class App extends Component {
  render () {
    return (
      <div>
        <div>{_.join(['this', 'is', 'app'], '')}</div>
      </div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('root'))
