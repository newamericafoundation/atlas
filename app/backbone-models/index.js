var base = require('./base'),
	baseFilter = require('./base_filter'),
	coreDatum = require('./core_datum'),
	filter = require('./filter'),
	image = require('./image'),
	infoBoxSection = require('./info_box_section');

window.Models = {

	BaseModel: base.Model,
	BaseCollection: base.Collection,

	BaseFilterModel: baseFilter.Model,
	BaseFilterCollection: baseFilter.Collection,

	CoreDatum: coreDatum.Model,
	CoreData: coreDatum.Collection,

	Filter: filter.Model,
	Filters: filter.Collection

};