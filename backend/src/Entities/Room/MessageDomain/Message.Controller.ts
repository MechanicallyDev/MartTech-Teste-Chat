import { Request, Response } from 'express'
import model from './Message.Model'

export default {
  async readMessages(request: Request, response: Response) {
    try {
      const { room } = request.params
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
      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          return response.status(401).json({ error: 'jwt expired' })
        }
        if (error.message === 'invalid token') {
          return response.status(401).json({ error: 'invalid token' })
        }
        if (error.message === 'invalid signature') {
          return response.status(401).json({ error: 'invalid signature' })
        }
        if (error.message === 'jwt malformed') {
          return response.status(401).json({ error: 'jwt malformed' })
        }
        return response.status(500).json({ error: error.message })
      }
    }
  }
}
