var Q = require('q'),
	mongo = require('mongodb'),
	express = require('express'),
	env = express().get('env'),
	config = require('./../config/index.json');

var MongoClient = mongo.MongoClient;
var deferred = Q.defer();

var dbUrl = 'mongodb://' + config.dbUrl[env] + ':27017/mongoid';

MongoClient.connect(dbUrl, function(err, database) {
	if (err) {
		deferred.reject(err);
		return;
	}
	console.log('Successfully connected to database.');
	deferred.resolve(database);
});

exports.connected = function() {
	return deferred.promise;
};