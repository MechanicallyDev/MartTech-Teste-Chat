import { Request, Response } from 'express'
import model from './Message.Model'

export default {
  async readMessages(request: Request, response: Response) {
    try {
      const { room } = request.body
      const messages = await model.getMessages(room)
      return response.json(messages)
    } catch (error) {
      console.log(error)
    }
  },

  async sendMessages(request: Request, response: Response) {
    try {
      const { room, message, token } = request.body
      const sentMessage = await model.sendMessage(room, message, token)
      return response.json(sentMessage)
    } catch (error) {
      console.log(error)
    }
  }
}
