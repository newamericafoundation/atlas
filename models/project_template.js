var mongoose = require('mongoose');

var schema = new mongoose.Schema({}, { collection: 'project_templates' });

exports.Model = mongoose.model('ProjectTemplate', schema);