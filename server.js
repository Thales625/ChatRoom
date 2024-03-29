const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

const port = 8765;

const users = [];
const messages = [];

function getTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${period}`;
}

function getUserById(id) {
    for(const user of users) {
        if (user.id == id) return user;
    }
}

io.on("connection", socket => {
    socket.once("setname", name => {
        users.push({ // PUSH USER
            id: socket.id,
            name: name,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        });
        
        socket.on("message", msg => { // ON RECEIVE MESSAGE
            if (msg.trim() == "") return;
            
            const message = {
                author: getUserById(socket.id),
                text: msg,
                time: getTime()
            };
            
            messages.push(message);
            
            io.emit("message", JSON.stringify(message));
            
            console.log("Message:", msg, "from:", socket.id);
        });

        socket.on("update-messages", () => { socket.emit("update-messages", JSON.stringify(messages)) });
        socket.on("update-users", () => { socket.emit("update-users", JSON.stringify(users)) });


        io.emit("update-users", JSON.stringify(users));
    });
    
    socket.on("disconnect", reason => {
        for (let i=0; i<users.length; i++) { // REMOVE USER
            if (users[i].id === socket.id) {
                users.splice(i, 1);
                break;
            }
        }

        io.emit("update-users", JSON.stringify(users));

        console.log("> User disconnected");
    });

    socket.emit("setup", JSON.stringify({
        users: users,
        messages: messages
    }));

    console.log("> User connected");
});

server.listen(port, () => {
    console.log("> Server running:", port);
});