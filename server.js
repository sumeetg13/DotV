const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))
app.get('/room/:roomId', (req, res) => res.sendFile(__dirname + '/public/room.html'))

io.on('connection', socket => {
  socket.on('join', room => {
    socket.join(room)
    socket.to(room).emit('user-joined')
    socket.on('offer', data => socket.to(room).emit('offer', data))
    socket.on('answer', data => socket.to(room).emit('answer', data))
    socket.on('ice-candidate', data => socket.to(room).emit('ice-candidate', data))
  })
})

server.listen(3000, () => console.log('http://localhost:3000'))
