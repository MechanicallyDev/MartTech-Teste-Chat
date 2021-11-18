import jwt from 'jsonwebtoken'

export default {
  sign(payload: any, secret: string, expiresIn: string) {
    return jwt.sign(payload, secret as string, {
      expiresIn: expiresIn
    })
  },

  verify(token: string, secret: string) {
    const data = jwt.verify(token, secret as string)
    if (!data) throw new Error('Token is invalid')
    return data
  },
}
