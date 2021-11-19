import database from '@database/client'
import UserModel from 'Entities/User/User.Model'
import RoomModel from '../Room.Model'

export default {
  async getMessages(room: string) {
    const roomId = await RoomModel.getRoomBySlug(room)

    const messages = await database.message.findMany({
      where: {
        roomId: roomId?.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return messages
  },

  async sendMessage(room: string, message: string, token: string) {
    if (!room || !message || !token) return null
    const roomId = await RoomModel.getRoomBySlug(room)
    const user = await UserModel.getIdFromToken(token)
    if (!roomId || !user) return null

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
  }
}
