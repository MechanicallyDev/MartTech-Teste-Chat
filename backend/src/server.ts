import express from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>res.send("Server started correctly."))

app.listen(3333, ()=>{console.log(`Server started on http://localhost:3333`)})