import { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import axios from 'axios'
import moment from 'moment'
import tz from 'moment-timezone'
import io from 'socket.io-client'

import { Text, Input, Button } from '@nextui-org/react'
import styled from 'styled-components'
import mySvg from './images/background.svg'

const socket = io.connect('http://localhost:3344')

function App() {
  const history = useHistory()
  const chatElement = useRef(null)
  const [listRooms, setListRooms] = useState([])
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('@MartTech-Chat/user')) || {}
  )
  const [room, setRoom] = useState('')
  const [listMessages, setMessages] = useState([])
  const [newRoomName, setNewRoomName] = useState('')

  axios.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      if (error.response.status === 401) await renewTokens()
      return error
    }
  )

  useEffect(() => {
    if (Object.entries(user).length !== 0) {
      socket.on('connect', () => {
        console.log('connected')
      })
      socket.on('disconnect', () => {
        console.log('disconnected')
      })
      socket.on('message', message => {
        const newMessage = {
          id: `WS_${message.name}.${message.createdAt}`,
          user: { name: message.name },
          text: message.text,
          createdAt: message.createdAt
        }
        setMessages(listMessages => [...listMessages, newMessage])
      })
    } else {
      history.push('/login')
    }
  }, [])

  function joinRoom(name, room) {
    socket.emit('join_room', { name, room })
  }

  async function createRoom() {
    if (newRoomName.length > 0) {
      const response = await axios.post(`http://localhost:3333/chat/new`, {
        name: newRoomName,
        token: user.accessToken
      })
      setListRooms([...listRooms, response.data])
    } else {
      alert('Preencha o nome da sala.')
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (room) {
      const message = e.target.message.value
      socket.emit('messageListener', message)
      const response = await axios.post(
        'http://localhost:3333/chat/messages',
        {
          room: room,
          message: message,
          token: user.accessToken
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      chatElement.current.scrollTop = chatElement.current.scrollHeight
      e.target.message.value = ''
    } else {
      alert('Entre em uma sala antes de enviar uma mensagem.')
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:3333/chat/list')
      setListRooms(result.data)
    }
    fetchData()
  }, [listRooms])

  function toTimeZone(time, zone) {
    var format = 'DD/MM/YYYY HH:mm'
    moment.locale('pt-br')
    return moment(time).tz(zone).format(format)
  }

  const handleRoomChange = async slug => {
    const room = slug
    setRoom(room)
    const result = await axios.get(
      `http://localhost:3333/chat/messages/${room}`
    )
    setMessages(result.data)
    joinRoom(user.name, room)
  }

  return (
    <Container style={{ backgroundImage: `url(${mySvg})` }}>
      <SideBar>
        <Text h2>Salas</Text>
        <div>
          <input
            style={{marginRight: '10px'}}
            name='message'
            placeholder='Nome da sala'
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
          />
          <Button onClick={createRoom} size='small' auto ghost>
            Criar
          </Button>
        </div>

        <Button.Group size='xlarge' vertical color='gradient' bordered>
          {listRooms && listRooms.map(room => (
            <Button key={room.id} onClick={() => handleRoomChange(room.slug)}>
              <Text h6>{room.name}</Text>
            </Button>
          ))}
        </Button.Group>
      </SideBar>
      <ChatContainer>
        {room && listMessages && (
          <Chat ref={chatElement}>
            {listMessages && listMessages.map(message => (
              <Message key={message.id}>
                <Info>
                  <Author>
                    <Text h5>{message.user.name}</Text>
                    <Text h6>
                      {toTimeZone(message.createdAt, 'America/Sao_Paulo')}
                    </Text>
                  </Author>
                  <TextMessage>{message.text}</TextMessage>
                </Info>
              </Message>
            ))}
          </Chat>
        )}
        {room && listMessages.length === 0 && (
          <Chat>
            <Message warning>
              Esta sala ainda não tem mensagens. Seja o primeiro a enviar!
            </Message>
          </Chat>
        )}
        {!room && (
          <Chat>
            <Message warning>Escolha uma sala no menu ao lado</Message>
          </Chat>
        )}
        <TextBar>
          <form onSubmit={e => sendMessage(e)} style={{ width: '90%' }}>
            <Input
              name='message'
              clearable
              width='90%'
              contentRightStyling={false}
              placeholder='Digite sua mensagem...'
              contentRight={
                <Button type='submit' size='small' auto ghost>
                  Enviar
                </Button>
              }
            />
          </form>
        </TextBar>
      </ChatContainer>
    </Container>
  )
}

export default App

const Info = styled.div`
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Message = styled.div`
  display: flex;
  background: #ffffffaa;
  ${props =>
    props.warning
      ? 'background: #ff000077;color:#fff;justify-content:center;'
      : ''}
  width: 90%;
  align-items: center;
  padding: 10px 20px;
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: 2px 2px 4px #11111166;
`

const Author = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const TextMessage = styled.div`
  margin: 4px 0;
`

const Chat = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 auto;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-size: cover;
`

const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px 0;
  align-items: center;
  width: clamp(200px, 25vw, 300px);
  height: 100vh;
  background: #ffffffaa;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
`

const ChatContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
`

const TextBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  input {
    width: 100%;
  }
`
