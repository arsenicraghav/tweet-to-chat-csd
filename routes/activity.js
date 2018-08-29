const socket = require('../helpers/socket')

var activity = function (req, resp) {
    var json_response = {
        socket_host: req.headers.host.indexOf('127.0.0.1') == 0 ? 'http://' + req.headers.host : 'https://' + req.headers.host,
        activity_event: socket.activity_event
    }
    return json_response;
}

module.exports = activity