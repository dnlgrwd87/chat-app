// Make socket connection
const socket = io.connect('http://localhost:8080');

// Query DOM
const message = document.querySelector('#message');
const handle = document.querySelector('#handle');
const chatForm = document.querySelector('#chat-form');
const output = document.querySelector('#output');
const feedback = document.querySelector('#feedback');

const chatInfo = () => ({ message: message.value, handle: handle.value });

// Emit events
chatForm.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('chat', chatInfo());
});

message.addEventListener('keyup', () => {
    socket.emit('typing', chatInfo());
});

// Listen for events
socket.on('chat', data => {
    // If front end and back end sockets are the same, clear input
    // This is so the input only clears for user that sent message
    const sameUser = data.id === socket.id;
    let alignStyle = 'margin-left: auto';

    let handlePrefix = `${data.handle}: `;
    const lastEntry = output.children[output.children.length - 1];
    console.log(lastEntry);

    if (lastEntry) {
        if (lastEntry.classList[0] === data.handle.toLowerCase()) {
            handlePrefix = '';
        }
    }

    if (sameUser) {
        message.value = '';
        alignStyle = '';
    }

    feedback.innerHTML = '';
    output.innerHTML += `<p class="${data.handle.toLowerCase()}">
        <span style="${alignStyle}">
            <strong>${handlePrefix}</strong> 
            ${data.message}
        <span>
    </p>`;
});

socket.on('typing', ({ message, handle }) => {
    const showFeedback = message.length && handle.length;
    feedback.innerHTML = showFeedback ? `<p><em>${handle} is typing a message...</em></p>` : '';
});
