var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({}, { collection: 'core_data' });

var CoreDatum = mongoose.model('CoreDatum', schema);

exports.Model = CoreDatum;