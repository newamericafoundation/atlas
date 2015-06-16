var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'researchers' });

exports.Model = mongoose.model('Researcher', schema);