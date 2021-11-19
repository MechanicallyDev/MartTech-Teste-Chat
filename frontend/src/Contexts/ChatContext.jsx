import { useState, createContext, useContext } from 'react'
import axios from 'axios'

export const ChatContext = createContext({})

export function ChatProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('@MartTech-Chat/user')) || {}
  )

  function isLoggedIn() {
    const isLogged = Object.entries(user).length !== 0
    return isLogged
  }

  async function register(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('Preencha todos os campos')
    }
    const response = await axios.post('http://localhost:3333/user/register', {
      name: name,
      email: email,
      password: password
    })
    const { verificationToken } = response.data
    return verificationToken
  }

  async function login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Preencha todos os campos')
      }
      const response = await axios.post('http://localhost:3333/user/login', {
        email: email,
        password: password
      })
      const { name, accessToken, refreshToken } = response.data
      localStorage.setItem(
        `@MartTech-Chat/user`,
        JSON.stringify({ name, accessToken, refreshToken })
      )
      setUser({ name, accessToken, refreshToken })
    } catch (error) {
      console.log(error)
    }
  }

  async function logout() {
    localStorage.removeItem(`@MartTech-Chat/user`)
    setUser({})
    await axios.delete('http://localhost:3333/user/logout', {
      headers: {
        Authorization: user.refreshToken
      },
      data: {
        token: user.refreshToken
      }
    })
  }

  return (
    <ChatContext.Provider
      value={{ user, login, isLoggedIn, logout, register }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)

  if (context === undefined) {
    throw new Error('Context was used outside of its Provider')
  }

  return context
}
