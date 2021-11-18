import { User } from '.prisma/client'
import Token from './_GenericToken'
import store from './_TokenStore'

interface ITokenUser extends User {
  iat?: number,
  exp?: number
} 

export default {
  async getUser(token: string) {
    const user = await Token.verify(token,process.env.VERIFICATION_TOKEN_SECRET as string) as ITokenUser
    if (!user) throw new Error('Invalid token')
    return user;
  },

  async generate(user: User) {
    const verificationToken = await Token.sign(user,process.env.VERIFICATION_TOKEN_SECRET as string,'7d')
    await store.set(`verification:${user.email}`,verificationToken,7*24*60*60)
    return verificationToken
  },

  async doesExist(token: string) {
    if (token == null) throw new Error('No token provided')
    const user = await this.getUser(token)
    const exists = await store.get(`verification:${user.email}`)
    if (exists==null) throw new Error('Invalid token')
    if (exists!=token) throw new Error('Invalid token')
    return exists
  },

  async revoke(revokedToken: string) {
    const user = await this.getUser(revokedToken)
    await store.del(`verification:${user.email}`)
  },
}