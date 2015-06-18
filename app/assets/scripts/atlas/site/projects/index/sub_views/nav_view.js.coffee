@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	class Index.NavView extends Marionette.LayoutView
		tagName: 'div'
		className: 'atl__nav'
		template: 'projects/index/templates/nav/root'
		regions:
			sectionFilter: '#atl__project-section-filter'
			templateFilter: '#atl__project-template-filter'