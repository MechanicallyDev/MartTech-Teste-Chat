import { useState } from 'react'
import styled from 'styled-components'
import { Button } from '@nextui-org/react'
import { useChat } from './Contexts/ChatContext'

import mySvg from './images/background.svg'

export default function LoginPage() {
  const { user, login, logout } = useChat()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    login(email, password)
  }
  

  return (
    <Container style={{ backgroundImage: `url(${mySvg})` }}>
      
      { Object.entries(user).length !== 0 && <Form><div>Logado como {user.name} <p><button onClick={logout}>Deslogar?</button></p><p><a href='/'>Acessar chat</a></p></div></Form>}
      { Object.entries(user).length === 0 && (
        <Form onSubmit={e => handleSubmit(e)}>
          <h1>Efetuar Login</h1>
          <input
            name='email'
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button type='submit'>Login</Button>
          <div><a href='/registrar'>Ainda não tenho uma conta</a></div>
        </Form>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-size: cover;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: #ffffffaa;
  ${props =>
    props.warning
      ? 'background: #ff000077;color:#fff;justify-content:center;'
      : ''}
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 400px;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px 20px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 2px 2px 4px #11111166;

  input, button, a {
    width: 100%;
  }
  a {
    margin-top: 20px;
  }
`