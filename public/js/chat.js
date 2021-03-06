
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
    }
  });
});



socket.on('newMsg',function (newMsg) {
  var formattedTime = moment(newMsg.createdAt).format('h:mm a');
  var template = newMsg.from !== "Admin" ? $('#user-msg-template').html() : $('#admin-msg-template').html();
  var imgSrc = "http://photos.planetadeagostini.es/t17/r/81/2081.jpg";

  var html = Mustache.render(template, {
    text: newMsg.text,
    from: newMsg.from,
    createdAt: formattedTime,
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

socket.on('updateUserList', function(users) {
  var ol = $('<ol></ol>');
  users.userList.forEach(function(user) {
    ol.append($('<li></li>').attr('id',user.id).text(user.name));
  });
  $('#users').html(ol);
});

//---------------keyup---------------------
$('#msg-input').keyup(function() {
  var params = $.deparam(window.location.search);
  socket.emit("keyup", params);

})

//---------------hide Typing--------------------
socket.on("hideTyping",function(id) {
  if ($("#i"+id).length > 0) {

    $("#i"+id).remove();
  }
});


//-------------keydown--------------------
$('#msg-input').keydown(function() {
  var params = $.deparam(window.location.search);
  socket.emit('keydown',params);
});

//-------------show typing--------------------
socket.on('showTyping', function(id) {
  if ($("#i"+id).length === 0) {
    typing = $('<i>  typing ...</i>');
    typing.attr("id","i"+id);
    $('#'+id).append(typing);
  }
});

//--------------------lan list----------------------------
socket.on("lanList",function(lanList) {
  for(var lan in lanList) {
    $("#lan-list").append($("<option class=lan-Opt></option>").attr("value",lanList[lan]).text(lanList[lan]));
  }

});

//---------------------create msg---------------------
$('#msg-form').on('submit', function(e) {
  e.preventDefault();
  var msgTextBox = $('#msg-input');
  var lanSelectionBox = $('#lan-list');
  socket.emit('createMsg',{
    text: msgTextBox.val(),
    lan: lanSelectionBox.val()
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
