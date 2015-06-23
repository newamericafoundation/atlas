var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'core_data' });

exports.Model = mongoose.model('CoreDatum', schema);