const connDiv = document.getElementById("connection");
const connStatus = document.getElementById("conn-status");

const mainDiv = document.getElementById("main-div");
const textInput = document.getElementById("message-input");
const buttonInput = document.getElementById("message-button");

const chatContainer = document.getElementById("chat-container");

function sendMessage() {
    const msg = textInput.value;
        
    if (msg.trim() == "") return;

    socket.emit("message", msg);
    textInput.value = "";

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setupChat(messages) {
    chatContainer.innerHTML = "";
    for (const message of messages) {
        addMessage(message);
    }
    
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 500);
}

function addMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";

    msgDiv.innerHTML = `<strong style="color: ${message.author.color}">${message.author.name}:</strong> ${message.text} | ${message.time}`;
    
    msgDiv.style.backgroundColor = message.author.id == socket.id ? "#005c4b" : "#202c33";

    chatContainer.appendChild(msgDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}