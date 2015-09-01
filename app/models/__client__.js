// Do not bundle researcher.

var base = require('./base.js'),
	baseFilter = require('./base_filter.js'), 
	coreDatum = ('./core_datum.js'), 
	filter = require('./filter.js'), 
	image = require('./image.js'), 
	item = require('./item.js'), 
	project = require('./project.js'), 
	projectSection = require('./project_section.js'), 
	projectTemplate = require('./project_template.js'), 
	richGeoFeature = require('./rich_geo_feature.js'), 
	variable = require('./variable.js');

window.Atlas.module('Models', function(Models) {

	Models.BaseModel = base.Model;
	Models.BaseCollection = base.Collection;

	Models.BaseFilterModel = baseFilter.Model;
	Models.BaseFilterCollection = baseFilter.Collection;

	Models.CoreDatum = coreDatum.Model;
	Models.CoreData = coreDatum.Collection;

	Models.Filter = filter.Model;
	Models.Filters = filter.Collection;

	Models.Image = image.Model;
	Models.Images = image.Collection;

	Models.Item = item.Model;
	Models.Items = item.Collection;

	Models.Project = project.Model;
	Models.Projects = project.Collection;

	Models.ProjectSection = projectSection.Model;
	Models.ProjectSections = projectSection.Collection;

	Models.ProjectTemplate = projectTemplate.Model;
	Models.ProjectTemplates = projectTemplate.Collection;

	Models.RichGeoFeature = richGeoFeature.Model;
	Models.RichGeoFeatures = richGeoFeature.Collection;
	
	Models.Variable = variable.Model;
	Models.Variables = variable.Collection;
	
});

window.M = {
	base: base,
	project: project,
	projectSection: projectSection,
	projectTemplate: projectTemplate,
	item: item,
	variable: variable,
	image: image,
	coreDatum: coreDatum,
	filter: filter
};