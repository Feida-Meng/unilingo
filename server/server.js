const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
const app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log('New user connected');

  socket.emit('greeting',{
    from: 'Admin',
    text: 'Welcome to the chatting room!! ' + new Date().getTime()
  });

  socket.broadcast.emit('newcomer',{
    from: 'Admin',
    text:'New user joined ' + new Date().getTime()
  });


  socket.on('createMsg', (msg) => {
    console.log('new Msg created',msg);
    io.emit('newMsg', {
      from: msg.from,
      text: msg.text,
      createdAt: new Date().getTime()
    });

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
