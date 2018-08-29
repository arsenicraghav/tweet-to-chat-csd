'use strict';

var db = require('./dataBase').db;

var getUser = exports.getUser = function (user, callback) {
    db.users.findOne({localuser: user}, function (err, usr) {
        if (!usr) {
            callback(null);
        }else{
            callback(usr);
        }

    });
};

var hasUser = exports.hasUser = function (email, callback) {
    getUser(email, function (user) {
        if (user) {
            callback(true);
        } else {
            callback(false);
        }
    });
};


exports.addUser = function (data, callback) {
    db.users.save(data, function (error, saved) {
        if (!error){
            callback(saved);
        }
    });
};
