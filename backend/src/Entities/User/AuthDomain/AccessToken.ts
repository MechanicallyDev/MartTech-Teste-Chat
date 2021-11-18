import Token from './_GenericToken'
import { User } from '.prisma/client'

export default {
  async generate(user: User) {
    const accessToken = await Token.sign(user,process.env.ACCESS_TOKEN_SECRET as string,'1200s')
    if (!accessToken) throw new Error('Error generating access token')
    return accessToken
  },
}