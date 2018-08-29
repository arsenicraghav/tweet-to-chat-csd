/*global require, exports*/
'use strict';

var config = require("./../config");

var databaseUrl = config.mongoURL;

var collections = ['users'];

var mongojs = require('mongojs');

exports.db = mongojs(databaseUrl, collections);