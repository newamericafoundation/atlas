var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	title: { type: String, required: true },
	atlas_url: { type: String, unique: true },
	updated_at: { type: Date, default: Date.now },
	project_section_id: { type: Number },
	project_template_id: { type: Number }
}, { collection: 'projects' });

var Project = mongoose.model('Project', schema);

exports.Model = Project;