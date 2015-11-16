import { MongoClient } from 'mongodb'
import express from 'express'

var { NODE_ENV, PRODUCTION_DB_URL } = process.env

function getDbUrl() {
	var dbUrlBase = (NODE_ENV === 'development') ? 'localhost' : PRODUCTION_DB_URL;
	return `mongodb://${dbUrlBase}:27017/mongoid`;
}

export default new Promise((resolve, reject) => {

	var dbUrl = getDbUrl()
	console.log(dbUrl)

	MongoClient.connect(getDbUrl(), (err, db) => {
		if (err) {
			console.log('Unable to connect to the database.');
			return reject(err); 
		}
		console.log('Successfully connected to database.');
		resolve(db);
	});

})