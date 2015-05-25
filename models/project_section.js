var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	_id: { type: Number, required: true, unique: true },
	name: { type: String, required: true, unique: true },
	updated_at: { type: Date, default: Date.now }
}, { collection: 'project_sections' });

exports.Model = mongoose.model('ProjectSection', schema);