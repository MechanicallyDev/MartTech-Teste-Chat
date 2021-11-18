import express from 'express'
import controller from './Room.Controller'

const routes = express.Router()

routes.get('/list', controller.listRooms)
routes.get('/room/:slug', controller.accessRoom)
routes.post('/create', controller.createRoom)
routes.put('/rename/:id', controller.renameRoom)

export default routes
