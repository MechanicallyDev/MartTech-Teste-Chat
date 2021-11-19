import redis from './_Message.WS.Store'

interface IUser {
  id: string
  name: string
  room: string
}
// const users: IUser[] = []

export default {
  async JoinRoom(id: string, name: string, room: string) {
    const user = { id, name, room }
    // users.push(user)
    redis.set(id, JSON.stringify(user), 60*60)
    return user
  },

  async getUser(id: string) {
    // return users.find(user => user.id === id)
    const user = await redis.get(id)
    if (user) return JSON.parse(user);
  },

  async LeaveRoom(id: string) {
    // const index = users.findIndex(user => user.id === id)

    // if (index !== -1) {
    //   return users.splice(index, 1)[0]
    // }
    await redis.del(id)
  },
}
