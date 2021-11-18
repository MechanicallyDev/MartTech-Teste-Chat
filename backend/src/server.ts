import express from 'express'
import cors from 'cors'

import User from './Entities/User/User.Entity'
import Room from 'Entities/Room/Room.Entity'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', User)
app.use('/chat', Room)

const host = process.env.APP_HOST || 'localhost'
const port = Number(process.env.APP_PORT) || 3333

app.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`)
})
