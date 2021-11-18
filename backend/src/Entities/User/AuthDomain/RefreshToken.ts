import Token from './_GenericToken'
import { User } from '.prisma/client'
import store from './_TokenStore'

interface ITokenUser extends User {
  iat?: number,
  exp?: number
} 

export default {
  async generate(user: User) {
    const refreshToken = await Token.sign(user,process.env.REFRESH_TOKEN_SECRET as string,'7d')
    await store.set(user.email,refreshToken,7*24*60*60)
    return refreshToken
  },

  async doesExist(token: string) {
    if (token == null) throw new Error('No token provided')
    const user = await this.getUser(token)
    const exists = await store.get(user.email)
    if (exists==null) throw new Error('Invalid token')
    if (exists!=token) throw new Error('Invalid token')
    return exists
  },

  async getUser(token: string) {
    const user = await Token.verify(token,process.env.REFRESH_TOKEN_SECRET as string) as ITokenUser
    if (!user) throw new Error('Invalid token')
    return user;
  },

  async revoke(revokedToken: string) {
    const user = await this.getUser(revokedToken)
    await store.del(user.email)
  },
}
