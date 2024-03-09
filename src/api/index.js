const { Server } = require('socket.io')

const app = require('express')()
const server = require('http').createServer(app)
const io = new Server(server)

io.on('connection', (socket) => console.log(`socket id: ${socket.id}`))

server.listen(80, () => console.log('server running at 80'))
