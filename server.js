const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static('public'))

io.on('connection', socket => {
  socket.on('join', room => {
    socket.join(room)
    socket.to(room).emit('user-joined')
    socket.on('offer', data => socket.to(room).emit('offer', data))
    socket.on('answer', data => socket.to(room).emit('answer', data))
    socket.on('ice-candidate', data => socket.to(room).emit('ice-candidate', data))
  })
})

server.listen(3000, () => console.log('Server running on http://localhost:3000'))
