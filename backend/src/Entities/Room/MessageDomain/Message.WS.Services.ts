import http from 'http'
import { Server } from 'socket.io'

import model from './Message.WS.Model'

const server = http.createServer()

const ws = new Server(server, {
  cors: {
    origin: '*'
  }
})

ws.on('connect', socket => {

  socket.on('join_room', async ({ name, room }) => {
    const user = await model.JoinRoom(socket.id, name, room)
    socket.join(user.room)
  })

  socket.on('messageListener', async message => {
    const user = await model.getUser(socket.id)
    if (user)
      ws.to(user.room).emit('message', {
        name: user.name,
        text: message,
        createdAt: new Date()
      })
  })

  socket.on('disconnect', async () => {
    await model.LeaveRoom(socket.id);
  });
});

export default ws
