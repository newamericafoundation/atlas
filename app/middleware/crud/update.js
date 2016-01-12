import { ObjectID } from 'mongodb'

export default function updateMiddleware(options, req, res, next) {

	var { id } = req.params
	var resourceData = JSON.parse(req.body.jsonString);

	// Delete id so that it is not set in the database (_id is already set).
	delete resourceData.id;

	var { db } = req
	var dbCollection = db.collection(options.dbCollectionName)

	dbCollection.update({ _id: new ObjectID(id) }, resourceData, (err, data) => {

		if (err) {
			console.dir(err)
			req.dbResponse = {
				'status': 'error',
				'message': 'Failed to update.'
			}
			return next()
		}

		req.dbResponse = {
			'status': 'success',
			'message': 'Updated successfully.'
		}
		
		return next()

	})

}