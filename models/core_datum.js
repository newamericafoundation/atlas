var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = new Schema({
	title: { type: String, required: true },
	atlas_url: { type: String, unique: true },
	updated_at: { type: Date, default: Date.now },
	project_section_id: { type: Number },
	project_template_id: { type: Number }
}, { collection: 'core_data' });

var CoreDatum = mongoose.model('CoreDatum', schema);

exports.Model = CoreDatum;