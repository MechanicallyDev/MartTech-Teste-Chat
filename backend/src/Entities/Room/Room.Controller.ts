import { Request, Response } from 'express'

export default {
  async listRooms(request: Request, response: Response) {
    return response.status(200).json({placeHolder:"List all rooms"})
  },
  async accessRoom(request: Request, response: Response) {
    return response.status(200).json({placeHolder:"Access a specific room"})
  },
  async createRoom(request: Request, response: Response) {
    return response.status(200).json({placeHolder:"Create a new Room"})
  },
  async renameRoom(request: Request, response: Response) {
    return response.status(200).json({placeHolder:"Rename a room"})
  },

}