const socket = io();
let name;
let room;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
    name = prompt('Please enter your name: ');
} while (!name);

do {
    room = prompt('Please enter the room (e.g., family, friends): ');
} while (!room);

// Display entering message
let enteringMessage = `you joined the roon as  ${room}`;
appendSystemMessage(enteringMessage);

// Emit 'join' event when a user joins the room
socket.emit('join', { user: name, room: room });

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }
});

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim(),
        room: room
    };
    // Append 
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    scrollToBottom();

    // Send to server 
    socket.emit('message', msg);
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className, 'message');

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;
    mainDiv.innerHTML = markup;
    messageArea.appendChild(mainDiv);
}

function appendSystemMessage(message) {
    let systemDiv = document.createElement('div');
    systemDiv.classList.add('system', 'message');

    let markup = `
        <p>${message}</p>
    `;
    systemDiv.innerHTML = markup;
    messageArea.appendChild(systemDiv);
}

// Receive messages 
socket.on('message', (msg) => {
    if (msg.room === room) {
        appendMessage(msg, 'incoming');
        scrollToBottom();
    }
});

// Handle 'join' event to display a system message when someone joins
socket.on('join', (data) => {
    if (data.room === room) {
        let joinMessage = `${data.user} joined the chat`;
        appendSystemMessage(joinMessage);
        scrollToBottom();
    }
});

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight;
}
