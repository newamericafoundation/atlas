var base = require('./base'),
	baseFilter = require('./base_filter'),
	coreDatum = require('./core_datum');

exports.Models = {

	BaseModel: base.Model,
	BaseCollection: base.Collection,

	BaseFilterModel: baseFilter.Model,
	BaseFilterCollection: baseFilter.Collection,

	CoreDatum: coreDatum.Model,
	CoreData: coreDatum.Collection

};

window.Models = exports.Models;