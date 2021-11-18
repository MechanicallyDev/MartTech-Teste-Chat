import express from 'express'
import controller from './User.Controller'

const app = express.Router()

app.get('/get/:id', controller.getUser)
app.post('/register', controller.register)
app.post('/login', controller.login)
app.get('/verify/:token', controller.verify)
app.post('/token', controller.renewTokens)
app.delete('/logout', controller.logout)

export default app
