var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'project_sections' });

exports.Model = mongoose.model('ProjectSection', schema);