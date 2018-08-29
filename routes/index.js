var express = require('express');
const passport = require('passport')
var config = require('./../config');

var router = express.Router();

var activity = require('./activity');

const socket = require('./../helpers/socket');
const uuid = require('uuid/v4');

var passwordless = require('passwordless');

var userDao = require('./../helpers/userDao');

router.get('/', function (req, res) {

    userDao.hasUser(req.user, function (has) {
        if (!has) {
            res.render('index', {user: req.user});
        } else {
            userDao.getUser(req.user, function (userDB) {
                var json_response = activity(req);
                console.log(json_response);
                res.render('index', {
                    user: userDB.localuser,
                    username: userDB.username,
                    displayName: userDB.displayName,
                    id: userDB.id,
                    socket_host: json_response.socket_host,
                    activity_event: json_response.activity_event
                });
            });
        }
    });
});


router.get('/logout', passwordless.logout(),
    function (req, res) {
        res.redirect('/');
    });

router.post('/sendtoken',
    passwordless.requestToken(
        function (user, delivery, callback) {
            callback(null, user);
            if (user) {
                userDao.hasUser(user, function (has) {
                    if (!has) {
                        userDao.addUser({localuser: user}, function (saved) {
                        });
                    }
                });
            }
        }),
    function (req, res) {
        res.send({"result": "success"});
    });

router.get('/subscriptions/add', passport.authenticate('twitter', {
    callbackURL: config.callbackURL
}));

router.get('/callbacks/:action', passport.authenticate('twitter', {failureRedirect: '/'}),
    require('./sub-callbacks'))


router.get('/success/:twitterid/:displayname/:username', passwordless.restricted(), function (req, res) {
    var data = {
        localuser: req.user,
        id: req.params.twitterid,
        displayname: req.params.displayname,
        username: req.params.username
    };
    if (req.user) {
        userDao.hasUser(req.user, function (has) {
            if (!has) {
                userDao.addUser(data, function (saved) {
                    res.redirect('/');
                });
            } else {
                userDao.getUser(req.user, function (userDB) {
                    userDB.id = req.params.twitterid;
                    userDB.username = req.params.username;
                    userDB.displayName = req.params.displayname;
                    userDao.addUser(userDB, function (saved) {
                        res.redirect('/');

                    });
                });
            }
        });
    }
});

var findSockets = function (twitterId) {
    console.log(twitterId);
    var socIds = new Map();
    socket.connectedSockets.forEach(function (tId, sockId) {
        if (tId === twitterId) {
            socIds.set(sockId, tId);
        }
    });
    return socIds;
};
/**
 * Receives Account Acitivity events
 **/
router.post('/webhook/twitter', function (request, response) {

    if(request.body.tweet_create_events) {
        var targetSockets = findSockets(request.body.for_user_id);
        console.log(targetSockets);

        console.log(socket.socketPool.size);
        if (socket.socketPool.size) {

            targetSockets.forEach(function (tId, sktId) {
                var curSocket = socket.socketPool.get(sktId);
                if (curSocket) {
                    curSocket.emit(socket.activity_event, {
                        internal_id: uuid(),
                        event: request.body
                    });
                }
            });
        }
    }
    response.send('200 OK')
})
module.exports = router;