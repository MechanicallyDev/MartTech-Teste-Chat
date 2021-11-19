import database from '@database/client'
import UserModel from 'Entities/User/User.Model'

export default {
  async createRoom(name: string, token: string) {
    try {
      const ownerID = await UserModel.getIdFromToken(token)
      const slug = name.toLowerCase().replace(/\s/g, '-')
      if (await this.roomAlreadyExists(slug)) {
        throw new Error('Room already exists')
      }
      const room = database.room.create({
        data: {
          name: name,
          slug: slug,
          owner: {
            connect: {
              id: ownerID
            }
          }
        }
      })
      return room
    } catch (error: any) {
      throw new Error(error.message)
    }
  },

  async renameRoom(slug: string, name: string, token: string) {
    try {
      const ownerID = await UserModel.getIdFromToken(token)
    const newSlug = name.toLowerCase().replace(/\s/g, '-')
    if (await this.roomAlreadyExists(newSlug)) {
      throw new Error('Room already exists')
    }

    const room = await database.room.updateMany({
      where: {
        AND: [{ slug:{equals:slug} }, { owner: { id: ownerID } }]
      },
      data: {
        name: name,
        slug: newSlug,
      }
    })
    } catch (error) {
      console.log(error)
    }
  },

  async roomAlreadyExists(slug: string) {
    const room = await database.room.findFirst({
      where: {
        slug: slug
      }
    })
    return room !== null
  },

  async getRoomBySlug(slug: string) {
    const room = await database.room.findFirst({
      where: {
        slug: slug
      }
    })
    return room
  },

  async listAll() {
    const rooms = await database.room.findMany()
    return rooms
  },

  async accessRoom(roomId: number) {
    const room = await database.room.findFirst({ where: { id: roomId } })
    return room
  }
}
