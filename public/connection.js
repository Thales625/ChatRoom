var username = "unknown";
do {
    username = prompt("Digite seu nome").trim();
} while (username == "" || username.length > 15);

const socket = io();

var users = [];

socket.once("setup", content => {
    socket.emit("setname", username);

    const data = JSON.parse(content);
 
    users = data.users;

    setupChat(data.messages);
});

socket.on("connect", () => {
    connStatus.innerText = "Connected!";
    setTimeout(() => {
        connDiv.hidden = true;
        mainDiv.hidden = false;
    }, 500);

    buttonInput.onclick = sendMessage;
    textInput.onkeydown = e => { if (e.key == "Enter") sendMessage(); }

    console.log("Connected to server!");
});

socket.on("message", msg => {
    addMessage(JSON.parse(msg));
});

socket.on("update-messages", messages => {
    setupChat(JSON.parse(messages));
})

socket.on("update-users", data => {
    users = JSON.parse(data);

    usersDiv.innerHTML = "";
    for (const user of users) {
        usersDiv.innerHTML += `<span style="color: ${user.color}">${user.name}</span>`;
    }
});

socket.on("disconnect", () => {
    connStatus.innerText = "Disconnected";
    connDiv.hidden = false;
    mainDiv.hidden = true;
    buttonInput.onclick = null;
});