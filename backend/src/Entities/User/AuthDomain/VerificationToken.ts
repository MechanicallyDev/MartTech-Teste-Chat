import { User } from '.prisma/client'
import Token from './_GenericToken'

let verificationTokens = ['']

export default {
  async generate(user: User) {
    const verificationToken = await Token.sign(user,process.env.VERIFICATION_TOKEN_SECRET as string,'7d')
    verificationTokens.push(verificationToken)
    return verificationToken
  },

  async getUser(token: string) {
    const user = await Token.verify(token,process.env.VERIFICATION_TOKEN_SECRET as string)
    if (user == null) throw new Error('Invalid token')
    return user
  },

  async doesExist(token: string) {
    if (token == null) throw new Error('No token provided')
    const exists = await verificationTokens.includes(token)
    if (!exists) throw new Error('Invalid token')
    return exists
  },

  async revoke(revokedToken: string) {
    verificationTokens = verificationTokens.filter(
      token => token !== revokedToken
    )
  },
}