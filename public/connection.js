const socket = io();

var users = [];

socket.once("setup", content => {
    const data = JSON.parse(content);
 
    users = data.users;

    setupChat(data.chat);
});

socket.on("connect", () => {
    connStatus.innerText = "Connected!";
    setTimeout(() => {
        connDiv.hidden = true;
        mainDiv.hidden = false;
    }, 500);

    var name = "unknown";
    do {
        name = prompt("Digite seu nome").trim();
    } while (name == "" || name.length > 15);

    socket.emit("setname", name);

    buttonInput.onclick = sendMessage;
    textInput.onkeydown = e => { if (e.key == "Enter") sendMessage(); }

    console.log("Connected to server!");
});

socket.on("message", msg => {
    addMessage(JSON.parse(msg));
});

socket.on("user-connection", data => {
    users.push(JSON.parse(data));
});
socket.on("user-disconnection", id => {
    for (let i=0; i<users.length; i++) { // REMOVE USER
        if (users[i].id === id) {
            users.splice(i, 1);
            break;
        }
    }
});

socket.on("disconnect", () => {
    connStatus.innerText = "Disconnected";
    connDiv.hidden = false;
    mainDiv.hidden = true;
    buttonInput.onclick = null;
});