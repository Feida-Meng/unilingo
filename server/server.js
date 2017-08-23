const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMsg } = require('./utils/msg');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log('New user connected');

  socket.emit('greeting',generateMsg('Admin','Welcome to the chatting room!!'));

  socket.broadcast.emit('newcomer',generateMsg('Admin','New user joined'));

  socket.on('createMsg', (msg, callback) => {
    console.log('new Msg created',msg);
    callback('This is from server: ');
    io.emit('newMsg',generateMsg(msg.from, msg.text));

    // socket.broadcast.emit('newMsg', {
    //   from: msg.from,
    //    text: msg.text,
    //    createdAt: new Date().getTime()
    // })
  });

  socket.on('disconnect', () => {
    console.log('Disconnected !!!!!!');
  });

});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
