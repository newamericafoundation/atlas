var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'projects' });

exports.Model = mongoose.model('Project', schema);