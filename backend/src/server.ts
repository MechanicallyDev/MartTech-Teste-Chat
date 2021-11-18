import express from 'express'
import cors from 'cors'

import User from './Entities/User/User.Entity'
import Room from 'Entities/Room/Room.Entity'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/user', User)
app.use('/chat', Room)


app.listen(3333, () => {
  console.log(`Server started on http://localhost:3333`)
})
