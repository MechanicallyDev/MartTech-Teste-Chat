import jwt from 'jsonwebtoken'

export default {
  async sign(payload: any, secret: string, expiresIn: any) {
    return await jwt.sign(payload, secret as string, {
      expiresIn: expiresIn
    })
  },

  async verify(token: string, secret: string) {
    const data = await jwt.verify(token, secret as string)
    if (!data) throw new Error('Token is invalid')
    return data
  },
}
