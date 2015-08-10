var base = require('./base.js'),
	baseFilter = require('./base_filter.js'), 
	coreDatum = ('./core_datum.js'), 
	filter = require('./filter.js'), 
	image = require('./image.js'), 
	infoBoxSection = require('./info_box_section.js'), 
	item = require('./item.js'), 
	project = require('./project.js'), 
	projectSection = require('./project_section.js'), 
	projectTemplate = require('./project_template.js'), 
	researcher = require('./researcher.js'), 
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

	Models.InfoBoxSection = infoBoxSection.Model;
	Models.InfoBoxSections = infoBoxSection.Collection;

	Models.Item = item.Model;
	Models.Items = item.Collection;

	Models.Project = project.Model;
	Models.Projects = project.Collection;

	Models.ProjectSection = projectSection.Model;
	Models.ProjectSections = projectSection.Collection;

	Models.ProjectTemplate = projectTemplate.Model;
	Models.ProjectTemplates = projectTemplate.Collection;

	Models.Researcher = researcher.Model;
	Models.Researchers = researcher.Collection;

	Models.RichGeoFeature = richGeoFeature.Model;
	Models.RichGeoFeatures = richGeoFeature.Collection;
	
	Models.Variable = variable.Model;
	Models.Variables = variable.Collection;
	
});