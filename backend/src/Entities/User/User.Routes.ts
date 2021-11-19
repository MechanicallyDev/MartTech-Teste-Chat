import express from 'express'
import controller from './User.Controller'

const routes = express.Router()

routes.get('/info/:id', controller.getUser)
routes.post('/register', controller.register)
routes.post('/login', controller.login)
routes.get('/verify/:token', controller.verify)
routes.post('/token', controller.renewTokens)
routes.delete('/logout', controller.logout)

export default routes
