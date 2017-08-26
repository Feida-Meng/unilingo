const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const translate = require('google-translate-api');

const { generateMsg, generateLocationMsg } = require('./utils/msg');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');
const { langs, isSupported, getCode} = require('./utils/languages');
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

    io.emit('updateRoomList',users.getRoomList());
    io.to(params.room).emit('updateUserList', {
      userList:users.getUserList(params.room),
      id: socket.id,
    });
    socket.emit('newMsg',generateMsg('Admin','Welcome to the chatting room!!'));
    socket.broadcast.to(params.room).emit('newMsg',generateMsg('Admin',`${params.name} has joined the room ${params.room}`));
    callback();
  });
  io.emit('updateRoomList',users.getRoomList());

  //-----------------------keydown-----------------------------
  socket.on('keydown', (params) => {
    io.to(params.room).emit('showTyping', socket.id);
  });

  //-----------------------keyup-------------------------------
  socket.on('keyup', (params) => {
    io.to(params.room).emit('hideTyping', socket.id);
  });


//---------------------created msg-------------------------
  socket.on('createMsg', (msg, callback) => {
    let user = users.getUser(socket.id);
    if (user && isRealString(msg.text)) {
      translate(msg.text, {to: getCode(msg.lan)}).then(res => {
        io.to(user.room).emit('newMsg',generateMsg(user.name, res.text));
      }).catch(err => {
          console.error(err);
      });
    }
    callback();
  });

//---------------------map link------------------------
  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocation',generateLocationMsg(user.name,coords));
    }

  });


//---------------------disconnect-----------------------
  socket.on('disconnect', () => {
    console.log('Disconnected !!!!!!');
    let user = users.removeUser(socket.id);
    io.emit('updateRoomList',users.getRoomList());
    if (user) {
      io.to(user.room).emit('updateUserList',{
        userList: users.getUserList(user.room)
      });
      io.to(user.room).emit('newMsg',generateMsg('Admin', `${user.name} has left.`))

    }
  });


});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
