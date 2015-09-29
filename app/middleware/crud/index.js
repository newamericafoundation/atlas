// Middleware reading a database collection.
// Handles queries, field selections etc.

import { ObjectID } from 'mongodb';
import _ from 'underscore';

var indexMiddleware = (options, req, res, next) => {

	var id = req.params.id;

	var db = req.db;

	var query = req.query || {},
		queryFields,
		fields = {};

	// If there is a fields query parameter, parse into MongoDB fields object and remove from query.
	if (query.fields) {

		queryFields = query.fields;
		delete query.fields;

		queryFields.split(',').forEach((fld) => {
			if (fld.slice(0, 1) === '-') {
				fields[fld.slice(1)] = 0;
			} else {
				fields[fld] = 1;
			}
		});

	}

	// If there are additional query parameters passed from the route calling the middleware, set those on the query.
	if (options.query) {
		Object.keys(options.query).forEach((key) => {
			query[key] = options.query[key];
		});
	}

	// If there are special query params (ones that cannot be handled by the database engine), remove from query and set on the req object.
	// The route calling this middleware will use req.special_query to filter results before sending to client.
	if (query.special_query_params) {

		req.special_query = {};

		query.special_query_params.split(',').forEach((pm) => {
			console.log(pm);
			req.special_query[pm] = query[pm];
			delete query[pm];
		});

		delete query.special_query_params;

	}

	var cursor = db.collection(options.dbCollectionName).find(query, fields);

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