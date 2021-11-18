import { Request, Response } from 'express'
import model from './User.Model'
import AccessToken from './AuthDomain/AccessToken'
import RefreshToken from './AuthDomain/RefreshToken'

export default {
  async register(request: Request, response: Response) {
    const { email, password, name } = request.body
    try {
      const newUser = await model.createUser({
        name,
        email,
        password
      })
      return response.status(201).json(newUser)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists')
          return response.status(400).send({ error: error.message })
        return response.status(500).json({ error: error.message })
      }
    }
  },

  async login(request: Request, response: Response) {
    const { email, password } = request.body
    try {
      const user = await model.tryLogin(email, password)
      const accessToken = await AccessToken.generate(user)
      const refreshToken = await RefreshToken.generate(user)
      return response.status(202).json({ accessToken, refreshToken })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or password')
          return response.status(400).send({ error: error.message })
        if (error.message === 'Email or password is missing')
          return response.status(400).send({ error: error.message })
        if (error.message === 'User is not verified')
          return response.status(400).send({ error: error.message })
        return response.status(500).json({ error: error.message })
      }
    }
  },

  async verify(request: Request, response: Response) {
    const { token } = request.params
    try {
      const user = await model.verifyUser(token)
      return response
        .status(202)
        .send(
          `User ${user.name} successfully verified the e-mail ${user.email}. Please login to continue.`
        )
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid email or token')
          return response.status(400).send({ error: error.message })
        if (error.message === 'User is not verified')
          return response.status(400).send({ error: error.message })
        return response.status(500).json({ error: error.message })
      }
    }
  },

  async logout(request: Request, response: Response) {
    await RefreshToken.revoke(request.body.token)
    return response.sendStatus(204)
  },

  async renewTokens(request: Request, response: Response) {
    const refreshToken = request.body.token
    try {
      await RefreshToken.doesExist(refreshToken)
      const user = await RefreshToken.getUser(refreshToken)
      delete user.exp;
      delete user.iat;
      const accessToken = await AccessToken.generate(user)
      await RefreshToken.revoke(request.body.token)

      const newRefreshToken = await RefreshToken.generate(user)
      return response
        .status(202)
        .json({ accessToken, newRefreshToken })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'No token provided')
          return response.status(400).json({ error: error.message })
        if (error.message === 'Invalid token')
          return response.status(403).json({ error: error.message })
        if (error.message === 'Error generating access token')
          return response.status(403).json({ error: error.message })
        return response.status(500).json({ error: error.message })
      }
    }
  },

  async getUser(request: Request, response: Response) {
    try {
      const user = await model.getUser(Number(request.params.id))
      return response.status(200).json(user)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found')
          return response.status(404).send({ error: error.message })
        return response.status(500).json({ error: error.message })
      }
    }
  }
}
