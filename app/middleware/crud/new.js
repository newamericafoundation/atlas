import { ObjectID } from 'mongodb';

var newMiddleware = (options, req, res, next) => {

	var db = req.db,
		dbCollection = db.collection(options.dbCollectionName);

	var resourceData = JSON.parse(req.body.jsonString);

	dbCollection.insert(resourceData, (err, data) => {

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

};

export default newMiddleware;