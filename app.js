const socket = new WebSocket('ws://192.168.43.29:3000'); // Ganti dengan URL server Anda

socket.onopen = () => {
    console.log('Connected to the WebSocket server');
};

// When a message is received from the server
socket.onmessage = (event) => {
    const message = event.data;
    const messagesDiv = document.getElementById('messages');
    const messageElem = document.createElement('div');
    messageElem.classList.add('message', 'server');
    messageElem.textContent = 'Server: ' + message;
    messagesDiv.appendChild(messageElem);
};

// When the send button is clicked
// Send message function
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();

    if (message) {
        socket.send(message); // Send the message to the server
        const messagesDiv = document.getElementById('messages');
        const messageElem = document.createElement('div');
        messageElem.classList.add('message', 'you');
        messageElem.textContent = 'You: ' + message; // Display the sent message locally
        messagesDiv.appendChild(messageElem);
        messageInput.value = ''; // Clear the input field after sending the message
    }
}

// Add event listener for the send button
document.getElementById('send-button').addEventListener('click', sendMessage);

// Add event listener for the Enter key on the message input
document.getElementById('message-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent new line in input
        sendMessage(); // Send message when Enter is pressed
    }
});
    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };
    
    socket.onclose = () => {
        console.log('Disconnected from the WebSocket server');
    };

   
    

