
var socket = io();
socket.on('connect',function() {
  console.log('connected to server');

  socket.on('greeting',function(msg) {
    console.log(msg.text);
  });

  socket.on('newcomer', function(msg) {
    console.log(msg.text);
  });

  socket.on('newMsg',function (newMsg) {
    console.log("New Msg",newMsg);
  });

});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});
