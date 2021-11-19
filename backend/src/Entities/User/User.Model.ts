import database from '@database/client'
import bcrypt from 'bcrypt'

import MailService from 'Utils/MailService'
import AccessToken from './AuthDomain/AccessToken'
import VerificationToken from './AuthDomain/VerificationToken'

export default {
  async createUser(data: { name: string; email: string; password: string }) {
    const userExists = await this.doesUserExist(data.email)
    if (userExists) throw new Error('User already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)
    data.password = hashedPassword
    const user = await database.user.create({ data })
    const verificationToken = await VerificationToken.generate(user)
    await MailService.sendEmailVerification(user.email, verificationToken)
    const userWithoutPassword = {
      ...user,
      verificationToken,
      password: undefined
    }
    return userWithoutPassword
  },

  async doesUserExist(email: string) {
    const user = await database.user.findFirst({
      where: {
        email: email
      }
    })
    return user
  },

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  },

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
  },

  async tryLogin(email: string, password: string) {
    if (!email || !password) throw new Error('Email or password is missing')

    const user = await this.doesUserExist(email)
    if (!user) throw new Error('Invalid username or password')

    if (user.isVerified === false) throw new Error('User is not verified')

    const isPasswordValid = await this.comparePassword(password, user.password)
    if (!isPasswordValid) throw new Error('Invalid username or password')

    return user
  },

  async getUser(id: number) {
    const user = await database.user.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (!user) throw new Error('User not found')
    return user
  },

  async verifyUser(token: string) {
    if (await VerificationToken.doesExist(token)) {
      const user = await VerificationToken.getUser(token)
      if (user == null) throw new Error('Invalid token')
      const { id } = await user
      const verifiedUser = await database.user.update({
        where: {
          id: id
        },
        data: {
          isVerified: true
        }
      })
      await VerificationToken.revoke(token)
      return verifiedUser
    } else {
      throw new Error('Token is required')
    }
  },

  async getIdFromToken(token: string) {
      const user = await AccessToken.getUser(token)
      if (user == null) throw new Error('Invalid token')
      return user.id    
  }
}
