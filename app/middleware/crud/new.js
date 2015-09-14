import dbConnector from './../../../db/connector.js';
import { ObjectID } from 'mongodb';

var newMiddleware = (options, req, res, next) => {

	return dbConnector.then((db) => {

		var collection = db.collection(options.dbCollectionName);

		var resourceData = JSON.parse(req.body.jsonString);

		console.log('inserting');

		collection.insert(resourceData, (err, data) => {

			if(err) { 

				console.dir(err);

				req.dbResponse = { 'status': 'error' };

				return next();

			}

			var savedResourceData = data.ops[0];

			req.dbResponse = { 
				status: 'success',
				id: savedResourceData._id
			};

			return next();	

		});
		

	}, (err) => {
		console.dir(err);
		req.dbResponse = { 
			status: 'error',
			message: 'Count not connect to database.'
		};
		return next();
	});

};

export default newMiddleware;