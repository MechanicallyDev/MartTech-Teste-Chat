import express from 'express'
import cors from 'cors'

import User from './Entities/User/User.Routes'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Server started correctly.'))

app.use('/user', User)

app.listen(3333, () => {
  console.log(`Server started on http://localhost:3333`)
})
