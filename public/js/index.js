
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

  let li = $('<li></li>');
  li.text(`${newMsg.from}: ${newMsg.text} at ${newMsg.createdAt}` );
  $('#msgs').append(li);
});

socket.on('newLocation', function(msg) {
  let li = $('<li></li>');
  let mapLink = $('<a target=_blank></a>');
  mapLink.text(`${msg.from} : User location at ${msg.createdAt}` );
  mapLink.attr('href', msg.url)
  li.append(mapLink);
  $('#msgs').append(li);
});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});


  $('#msg-form').on('submit', function(e) {
    e.preventDefault();

    socket.emit('createMsg',{
      from: 'User',
      text: $('#msg-input').val()
    }, function(msg) {
      console.log(msg+'Your new msg was received');
    });
  });

var locationBtn = $('#btn-location');
locationBtn.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not support by your brower.')
  }

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function() {
    alert('Unable to fetch location');
    // e.g. user decides not to share the location
  });
});
