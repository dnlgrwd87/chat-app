const express = require('express');
const path = require('path');
const logger = require('morgan');
const socket = require('socket.io');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));

const server = app.listen(8080, () => console.log('Listening on port 8080'));
const io = socket(server);

io.on('connection', socket => {
    socket.on('chat', data => io.sockets.emit('chat', { ...data, id: socket.id }));
    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    });
});
