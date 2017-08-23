
var socket = io();
socket.on('connect',function() {
  console.log('connected to server');
});

socket.on('greeting',function(msg) {
  console.log(msg.text);
});

socket.on('newcomer', function(msg) {
  console.log(msg.text);

});

socket.on('newMsg',function (newMsg) {
  console.log("New Msg",newMsg);
  var li = $('<li></li>');
  li.text(`${newMsg.from}: ${newMsg.text}` );
  $('#msgs').append(li);
});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});

$(document).ready(function($) {
  $('#msg-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMsg',{
      from: 'User',
      text: $('#msg-input').val()
    }, function(msg) {
      console.log(msg+'Your new msg was received');
    });
  });
});
