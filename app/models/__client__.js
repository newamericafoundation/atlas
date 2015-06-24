var base = require('./base'),
	baseFilter = require('./base_filter'), 
	coreDatum = ('./core_datum'), 
	filter = require('./filter'), 
	image = require('./image'), 
	infoBoxSection = require('./info_box_section'), 
	item = require('./item'), 
	project = require('./project'), 
	projectSection = require('./project_section'), 
	projectTemplate = require('./project_template'), 
	researcher = require('./researcher'), 
	richGeoFeature = require('./rich_geo_feature'), 
	variable = require('./variable');

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