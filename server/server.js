const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMsg, generateLocationMsg } = require('./utils/msg');
const { isRealString } = require('./utils/validation');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log('New user connected');

  socket.on('join',(params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required');
    }

    socket.join(params.room);

    socket.emit('greeting',generateMsg('Admin','Welcome to the chatting room!!'));
    socket.broadcast.to(params.room).emit('newMsg',generateMsg('Admin',`${params.name} has joined the room ${params.room}`));
    callback();
  });

  socket.on('createMsg', (msg, callback) => {
    console.log('new Msg created',msg);
    callback('This is from server: ');
    io.emit('newMsg',generateMsg(msg.from, msg.text));
  });

//---------------------map link------------------------
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocation',generateLocationMsg('Admin',coords));

  });


//---------------------disconnect-----------------------
  socket.on('disconnect', () => {
    console.log('Disconnected !!!!!!');
  });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
