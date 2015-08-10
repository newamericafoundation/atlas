var Q = require('q'),
	mongo = require('mongodb'),
	express = require('express'),
	env = express().get('env');

var MongoClient = mongo.MongoClient;
var deferred = Q.defer();

var dbUrlBase = (env === 'development') ? 'localhost' : process.env['PRODUCTION_DB_URL'];

var dbUrl = 'mongodb://' + dbUrlBase + ':27017/mongoid';

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