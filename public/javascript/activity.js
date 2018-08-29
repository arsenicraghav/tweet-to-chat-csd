(function () {

  var activity = {};

  activity.connect = function (socket_host, activity_event, id) {
    var socket = io.connect(socket_host);
      socket.on(activity_event, function (data) {
      console.log(data.event);
    });
    socket.emit('accountID',{id : id});
  };

  window.activity = activity;

})()