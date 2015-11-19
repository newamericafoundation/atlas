import { MongoClient } from 'mongodb'

export default new Promise((resolve, reject) => {

	var { NODE_ENV, PRODUCTION_DB_URL } = process.env

	var dbUrlBase = (NODE_ENV === 'development') ? 'localhost' : PRODUCTION_DB_URL
	var dbUrl = `mongodb://${dbUrlBase}:27017/mongoid`

	MongoClient.connect(dbUrl, (err, db) => {
		if (err) {
			console.log('Unable to connect to the database.')
			return reject(err);
		}
		console.log('Successfully connected to database.')
		resolve(db)
	})

})