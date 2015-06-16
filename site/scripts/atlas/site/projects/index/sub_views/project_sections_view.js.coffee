@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->


	class Index.ProjectSectionView extends Marionette.Accountant.FilterItemView

		tagName: 'li'
		className: 'toggle-button toggle-button--black'
		inactiveSubclassName: 'toggle-button--inactive'
		template: 'projects/index/templates/nav/project_section'
		events:
			'click': 'toggleActiveState'

		toggleActiveState: (e) ->
			@model.toggleActiveState()
			# notify project models to toggle their display state
			App.vent.trigger 'project:filter:change'



	class Index.ProjectSectionsView extends Marionette.CollectionView
		tagName: 'ul'
		className: 'atl__project-section-filter'
		childView: Index.ProjectSectionView

		onShow:
			App.vent.trigger 'project:filter:change'