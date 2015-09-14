import dbConnector from './../../../db/connector.js';
import { ObjectID } from 'mongodb';

var showMiddleware = (options, req, res, next) => {

	var id = req.params.id;

	return dbConnector.then((db) => {

		var cursor = db.collection(options.dbCollectionName).find({ _id: new ObjectID(id) });

		cursor.toArray((err, data) => {

			if (err) { 
				console.dir(err);
				req.dbResponse = {};
				return next();
			}
			var datum = data[0];
			if(datum && datum._id) {
				datum.id = datum._id;
				delete datum._id;
			}

			req.dbResponse = datum;
			return next();
		});

	}, (err) => { 

		console.dir(err); 
		req.dbResponse = {};
		return next();

	});

};

export default showMiddleware;