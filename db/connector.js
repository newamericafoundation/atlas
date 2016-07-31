import { MongoClient } from 'mongodb'

export default new Promise((resolve, reject) => {

	var { NODE_ENV, MONGODB_URI } = process.env

	MongoClient.connect(MONGODB_URI, (err, db) => {
		if (err) {
			console.log('Unable to connect to the database.')
			console.log(err)
			return reject(err)
		}
		console.log('Successfully connected to database.')
		resolve(db)
	})

})
