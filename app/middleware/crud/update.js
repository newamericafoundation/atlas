import { ObjectID } from 'mongodb';

var updateMiddleware = (options, req, res, next) => {

	var id = req.params.id,
		resourceData = JSON.parse(req.body.jsonString);

	// Delete id so that it is not set in the database (_id is already set).
	delete resourceData.id;

	var db = req.db;

	var collection = db.collection(options.dbCollectionName);
		
	collection.update({ _id: new ObjectID(id) }, resourceData, (err, data) => {

		if (err) {
			console.dir(err);
			req.dbResponse = {
				'status': 'error',
				'message': 'Failed to update.'
			};
			return next();
		}

		req.dbResponse = {
			'status': 'success',
			'message': 'Updated successfully.'
		};
		
		return next();

	});

};

export default updateMiddleware;