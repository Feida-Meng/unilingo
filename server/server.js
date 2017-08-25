const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMsg, generateLocationMsg } = require('./utils/msg');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log('New user connected');

  socket.on('join',(params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
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
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMsg',generateMsg('Admin', `${user.name} has left.`))

    }
  });


});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
