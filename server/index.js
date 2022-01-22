const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')
const socketIo = require('socket.io');

const port = 4500 || process.env.PORT;

const users = [{}];

app.use(cors());
app.get("/", (req, res) => {
    res.send("Hell its working");
})


const server = http.createServer(app)

const io = socketIo(server)

io.on("connection", (socket) => {
    console.log("New connection");

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        console.log(`${user} has joined`);

        socket.broadcast.emit('userJoined', { user: 'Admin', message: `${users[socket.id]} has joined` })
        socket.emit("welcome", { user: "Admin", message: `Welcome to the chat ${users[socket.id]}` })
    })

    socket.on("message", ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id })
    })

    socket.on('disconnected', () => {
        socket.broadcast.emit('userLeft', { user: "Admin", message: `${users[socket.id]} has left` })
        console.log('user left');
    })
})


server.listen(port, () => {
    console.log("working");
})