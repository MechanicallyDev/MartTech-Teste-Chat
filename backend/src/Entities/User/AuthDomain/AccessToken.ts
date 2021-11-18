import Token from './_GenericToken'
import { User } from '.prisma/client'

export default {
  async generate(user: User) {
    const accessToken = await Token.sign(
      user,
      process.env.ACCESS_TOKEN_SECRET as string,
      process.env.ACCESS_TOKEN_EXPIRATION
    )
    if (!accessToken) throw new Error('Error generating access token')
    return accessToken
  }
}
