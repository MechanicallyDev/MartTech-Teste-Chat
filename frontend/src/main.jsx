import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { CssBaseline } from '@nextui-org/react'
import { ChatProvider } from './Contexts/ChatContext'
import './normalize.css'

import App from './App'
import LoginPage from './Login'
import RegisterPage from './Register'

ReactDOM.render(
  <React.StrictMode>
    <ChatProvider>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={App} />
          <Route path='/login' component={LoginPage} />
          <Route path='/registrar' component={RegisterPage} />
        </Switch>
      </BrowserRouter>
    </ChatProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
