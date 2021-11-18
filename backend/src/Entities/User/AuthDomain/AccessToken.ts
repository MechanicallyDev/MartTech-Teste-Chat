import Token from './_GenericToken'
import { User } from '.prisma/client'

interface ITokenUser extends User {
  iat?: number
  exp?: number
}

export default {
  async getUser(token: string) {
    const user = (await Token.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    )) as ITokenUser
    if (!user) throw new Error('Invalid token')
    return user
  },

  async generate(user: User) {
    const accessToken = await Token.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      process.env.ACCESS_TOKEN_EXPIRATION as string
    )
    if (!accessToken) throw new Error('Error generating access token')
    return accessToken
  }
}
