import { Request, Response } from 'express'
import model from './Room.Model'

export default {
  async listRooms(request: Request, response: Response) {
    try {
      const rooms = await model.listAll()
      return response.status(200).json(rooms)
    } catch (error) {
      return response.status(500).json(error)
    }
  },
  async createRoom(request: Request, response: Response) {
    const {name, token} = request.body
    try {
      const room = await model.createRoom(name, token)
      return response.status(201)
    } catch (error: any) {
      if (error.message === 'Room already exists') {
        return response.status(409).json({error: "There is already a room with this name"})
      }
      return response.status(500).json(error)
    }
  },
  async renameRoom(request: Request, response: Response) {
    const {slug} = request.params
    const {name, token} = request.body
    try {
      const room = await model.renameRoom(slug, name, token)
      return response.status(201).json(room)
    } catch (error: any) {
      if (error.message === 'Room already exists') {
        return response.status(409).json({error: "There is already a room with this name"})
      }
      return response.status(500).json(error)
    }
  }
}
