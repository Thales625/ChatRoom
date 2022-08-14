const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const sockets = require('socket.io')(server)

app.set(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

console.log('Server Online!')

app.use('/', (req, res) => {
    res.render('index.html')
})

var users = []
var messages = []

sockets.on('connection', socket => {
    console.log(`Connected to ${socket.id}`)
    socket.emit('updateMessages', messages)

    sockets.emit('updateUsers', users)

    socket.once('setup', username => {
        users.push({
            name: username,
            id: socket.id
        })
        sockets.emit('updateUsers', users)
    })

    socket.on('sendMessage', data => {
        messages.push(data)
        sockets.emit('updateMessages', messages)
    })

    socket.on('disconnect', reason => {
        console.log(`${socket.id} has been disconnected, Reason: ${reason}`)
        users = users.filter(e => e.id !== socket.id) // REMOVE THE DISCONNECTED USER
        sockets.emit('updateUsers', users) // UPDATE THE CLIENTS
    })
})

server.listen(3000)