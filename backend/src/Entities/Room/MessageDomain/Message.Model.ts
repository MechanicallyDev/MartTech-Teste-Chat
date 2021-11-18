import database from '@database/client'
import UserModel from 'Entities/User/User.Model'
import RoomModel from '../Room.Model'

export default {
  async getMessages(room: string) {
    const roomId = await RoomModel.getRoomBySlug(room)

    const messages = await database.message.findMany({
      where: {
        roomId:  roomId?.id 
      }
    })
    console.log(messages)
    return messages
  },

  async sendMessage(room: string, message: string, token: string) {
    try {
      const roomId = await RoomModel.getRoomBySlug(room)
      const user = await UserModel.getIdFromToken(token)
      if (!roomId || !user || !message) return null

      const newMessage = await database.message.create({
        data: {
          text: message,
          room: {
            connect: {
              id: roomId.id
            }
          },
          user: {
            connect: {
              id: user
            }
          }
        }
      })
      return newMessage
    } catch (error) {
      console.log(error)
    }
  }
}
