var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'images' });

exports.Model = mongoose.model('Image', schema);