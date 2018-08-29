const socketIO = require('socket.io')
const uuid = require('uuid/v4')

var socket = { }

socket.activity_event = 'activity_event_' + uuid()

socket.connectedSockets = new Map();

socket.socketPool = new Map();

socket.init = function (server) {
  socket.io = socketIO.listen(server)

  socket.io.on('connection', (soc) => {
    console.log('Client connected: ' +soc.id)
      socket.socketPool.set(soc.id, soc);
      soc.on('disconnect', () => {
      console.log('Client disconnected')
          socket.socketPool.delete(soc.id);
    });
      soc.on('accountID', (data) => {
          console.log(soc.id)
          console.log(data);
          socket.connectedSockets.set(soc.id, data.id);
      });
  })
}


module.exports = socket