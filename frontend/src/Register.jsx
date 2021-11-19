import { useState } from 'react'
import { useChat } from './Contexts/ChatContext'

import styled from 'styled-components'
import mySvg from './images/background.svg'

import { Button } from '@nextui-org/react'

export default function RegisterPage() {
  const { user, logout, register } = useChat()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const token = await register(name, email, password)
      alert(
        `Token de verificação enviado para ${email}) - Mock, acessar console para obter link de verificação.`
      )
      console.log(
        `Para verificar sua conta, acesse: http://localhost:3333/user/verify/${token}`
      )
    } catch (error) {
      if (error.message === 'Request failed with status code 400')
        alert('Usuário já existe, você deseja fazer login?')
      else alert(error.message)
    }
  }

  return (
    <Container style={{ backgroundImage: `url(${mySvg})`}}>
      
      {Object.entries(user).length !== 0 && (
        <div>
          Você já está logado como {user.name}{' '}
          <p>
            <Button onClick={logout}>Deslogar?</Button>
          </p>
        </div>
      )}
      {Object.entries(user).length === 0 && (
        <Form onSubmit={e => handleSubmit(e)}>
          <h1>Registrar</h1>
          <input
            name='name'
            type='name'
            placeholder='name'
            value={name}
            onChange={e => setName(e.target.value)}
          />
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
          <Button type='submit'>Registrar</Button>
          <div>
            <a href='/login'>Já tenho uma conta</a>
          </div>
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

  input,
  button,
  a {
    width: 100%;
  }
  a {
    margin-top: 20px;
  }
`
