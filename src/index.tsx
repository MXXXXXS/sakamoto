import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'

import App from './app/App'
import { store } from './app/store'

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDom.render(<Root />, document.querySelector('#root'))
