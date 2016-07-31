import _ from 'underscore';

export default {

	replaceMongoId: function(data) {
		if (data && _.isArray(data)) {
			data.forEach((datum) => {
				if(datum && datum._id) {
					datum.id = datum._id;
					delete datum._id;
				}
			});
		}
	},

	isReqAuthenticated: function(req) {
		return (req.isAuthenticated() || (process.env.NODE_ENV === 'development'));
	}

};