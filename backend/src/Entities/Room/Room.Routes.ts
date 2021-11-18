import express from 'express'
import controller from './Room.Controller'
import Messages from './MessageDomain/Message.Routes'

const routes = express.Router()

routes.get('/list', controller.listRooms)
routes.get('/room/:slug', controller.accessRoom)
routes.post('/new', controller.createRoom)
routes.put('/rename/:slug', controller.renameRoom)

routes.use('/messages', Messages)

export default routes
