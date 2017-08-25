
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
  var formattedTime = moment(newMsg.createdAt).format('h:mm a');
  let li = $('<li></li>');
  li.text(`${newMsg.from}: ${newMsg.text} at ${formattedTime}` );
  $('#msgs').append(li);
});

socket.on('newLocation', function(msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  let li = $('<li></li>');
  let mapLink = $('<a target=_blank></a>');
  mapLink.text(`${msg.from} : User location at ${formattedTime}` );
  mapLink.attr('href', msg.url)
  li.append(mapLink);
  $('#msgs').append(li);
});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});


  $('#msg-form').on('submit', function(e) {
    e.preventDefault();
    var msgTextBox = $('#msg-input');
    socket.emit('createMsg',{
      from: 'User',
      text: msgTextBox.val()
    }, function(msg) {
      msgTextBox.val('');
    });
  });

var locationBtn = $('#btn-location');
locationBtn.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation not support by your brower.')
  }
  locationBtn.attr('disabled',true).text("sending");

  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    locationBtn.attr('disabled',false).text("send location");
  },function() {
    alert('Unable to fetch location');
    locationBtn.attr('disabled',false).text("send location");
    // e.g. user decides not to share the location
  });
});
