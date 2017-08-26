

var socket = io();


socket.on('updateRoomList', function(roomList) {
  console.log(roomList);
  $("#roomname").empty();
  for(var room in roomList) {
    $("#roomname").append($("<option> class=roomnameOpt").attr("value",room));
  }

});
