import React, { Component } from 'react'
import ReactDom from 'react-dom'
import _ from 'lodash'

class App extends Component {
  render () {
    return (
      <div>
        <div>{_.join(['welcome', 'to', 'noCLI'], ' ')}</div>
      </div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('root'))
