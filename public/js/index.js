
var socket = io();
socket.on('connect',function() {
  console.log('connected to server');

  socket.emit("createMsg",{
    from:'Dog',
    to: "afas@afaf.com",
    text: "safafd"
  });

  socket.on('newMsg',function (newMsg) {
    console.log("New Msg",newMsg);
  });

});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});
