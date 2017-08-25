
var socket = io();

function scrollToBottom() {
  var msgs = $('#msgs');
  var newMsg = msgs.children('li:last-child');

  var clientHeight = msgs.prop('clientHeight');
  var scrollTop = msgs.prop('scrollTop');
  var scrollHeight = msgs.prop('scrollHeight');
  var newMsgHeight = newMsg.innerHeight();
  var lastMsgHeight = newMsg.prev().innerHeight();

  if (scrollHeight - clientHeight - scrollTop <= lastMsgHeight + newMsgHeight) {
    msgs.scrollTop(scrollHeight);
  }


}

socket.on('connect',function() {
  var params = $.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No err');
    }
  });
});

socket.on('greeting',function(msg) {
  console.log(msg.text);
});

socket.on('newMsg',function (newMsg) {
  var formattedTime = moment(newMsg.createdAt).format('h:mm a');
  var template = $('#msg-template').html();
  var html = Mustache.render(template, {
    text: newMsg.text,
    from: newMsg.from,
    createdAt: formattedTime
  });
  $('#msgs').append(html);
  scrollToBottom();
});

socket.on('newLocation', function(msg) {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template = $('#location-msg-template').html();
  var html = Mustache.render(template, {
    url: msg.url,
    from: msg.from,
    createdAt: formattedTime
  });

  $('#msgs').append(html);
  scrollToBottom();
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
