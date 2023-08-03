const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

const port = 8765;

const users = []
const chat = []

function getUserById(id) {
    for(const user of users) {
        if (user.id == id) return user;
    }
}

io.on("connection", socket => {
    socket.emit("setup", JSON.stringify({
        users: users,
        chat: chat
    }));

    socket.once("setname", name => {
        users.push({ // PUSH USER
            id: socket.id,
            name: name,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        });
    });

    socket.on("message", msg => { // ON RECEIVE MESSAGE
        if (msg.trim() == "") return;

        const message = {
            author: getUserById(socket.id),
            text: msg
        };

        chat.push(message);

        io.emit("message", JSON.stringify(message));

        console.log("Message: ", msg, "from:", socket.id);
    });

    socket.on("disconnect", reason => {
        for (let i=0; i<users.length; i++) { // REMOVE USER
            if (users[i].id === socket.id) {
                users.splice(i, 1);
                break;
            }
        }

        console.log("> User disconnected");
    });

    console.log("> User connected");
});

server.listen(port, () => {
    console.log("> Server running:", port);
});