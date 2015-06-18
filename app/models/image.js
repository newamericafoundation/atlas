var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({}, { collection: 'images' });

var Image = mongoose.model('Image', schema);

exports.Model = Image;