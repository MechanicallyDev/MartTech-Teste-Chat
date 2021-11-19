import express from 'express'
import controller from './Message.Controller'

const routes = express.Router()

routes.get('/:room',  controller.readMessages)
routes.post('/', controller.sendMessages)

export default routes
