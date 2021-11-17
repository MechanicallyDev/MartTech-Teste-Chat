import express from 'express'
import controller from './User.Controller'

const app = express.Router()

app.post('/register', controller.register)
app.post('/login', controller.login)
app.post('/token', controller.renewTokens)
app.delete('/logout', controller.logout)
app.get('/user', controller.getUser)

export default app
