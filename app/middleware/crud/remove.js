import { ObjectID } from 'mongodb';
import _ from 'underscore';

var removeMiddleware = (options, req, res, next) => {

	var id = req.params.id;

	var db = req.db;

	db.collection(options.dbCollectionName).remove({ _id: new ObjectID(id) }, (err, summary) => {

		if(err) { 
			console.dir(err);
			req.dbResponse = { 'status': 'error' };
			return next();
		}

		if (!_.isObject(summary)) {
			summary = JSON.parse(summary);
		}

		console.log(`removed ${summary.n} documents`);

		req.dbResponse = { 'status': 'success' };

		return next();

	});

};

export default removeMiddleware