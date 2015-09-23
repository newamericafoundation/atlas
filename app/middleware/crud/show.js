import { ObjectID } from 'mongodb';

var showMiddleware = (options, req, res, next) => {

	var id = req.params.id;

	var db = req.db;

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


};

export default showMiddleware;