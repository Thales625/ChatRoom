const connDiv = document.getElementById("connection");
const connStatus = document.getElementById("conn-status");
const usersDiv = document.getElementById("users")

const mainDiv = document.getElementById("main-div");
const textInput = document.getElementById("message-input");
const buttonInput = document.getElementById("message-button");

const chatContainer = document.getElementById("chat-container");

function checkLocalCommands(txt) {
    if (!txt.startsWith("/")) return false;

    args = txt.split(" ");
    cmd = args.shift().replace("/", "");

    // clear
    if (cmd == "clear") {
        clearMessages();
        return true;
    }

    // scroll
    if (cmd == "scroll") {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return true;
    }

    // getchat
    if (cmd == "getchat") {
        socket.emit("update-messages");
        return true;
    }

    // getusers
    if (cmd == "getusers") {
        socket.emit("update-users");
        return true;
    }
}

function sendMessage() {
    const msg = textInput.value;
        
    if (msg.trim() == "") return;

    textInput.value = "";

    // LOCAL COMMANDS
    if (checkLocalCommands(msg)) return;

    socket.emit("message", msg);
}

function setupChat(messages) {
    chatContainer.innerHTML = "";
    for (const message of messages) {
        addMessage(message);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearMessages() {
    chatContainer.innerHTML = "";
}

function addMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    if (message.author.id == socket.id) msgDiv.id = "yourself";

    const msgText = document.createElement("span");
    const msgAuthor = document.createElement("span");
    const msgTime = document.createElement("span");

    msgText.id = "text";
    msgAuthor.id = "author";
    msgTime.id = "time";

    msgTime.innerText = message.time;

    msgAuthor.innerText = message.author.name;
    msgAuthor.style.color = message.author.color;
    
    // GLOBAL COMMANDS
    if (message.text.startsWith("/html ")) {
        msgText.innerHTML = message.text.replace("/html ", "");
    } else {
        msgText.innerText = message.text;
    }

    msgDiv.appendChild(msgAuthor)
    msgDiv.appendChild(msgText)
    msgDiv.appendChild(msgTime)

    const isBottom = chatContainer.scrollTop / (chatContainer.scrollHeight - chatContainer.clientHeight) > .98;
    
    chatContainer.appendChild(msgDiv);

    if (isBottom || message.author.id == socket.id) chatContainer.scrollTop = chatContainer.scrollHeight;
}