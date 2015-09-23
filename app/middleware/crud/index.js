import { ObjectID } from 'mongodb';
import _ from 'underscore';

var indexMiddleware = (options, req, res, next) => {

	var id = req.params.id;

	var db = req.db;

	var cursor = db.collection(options.dbCollectionName).find({});

	cursor.toArray((err, data) => {

		if (err) { 
			console.dir(err);
			req.dbResponse = {};
			return next();
		}

		// Replace _id's with id's.
		if (data && _.isArray(data)) {
			data.forEach((datum) => {
				if(datum && datum._id) {
					datum.id = datum._id;
					delete datum._id;
				}
			});
		}

		req.dbResponse = data;

		return next();
	});

};

export default indexMiddleware;