@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	# banner - template filter

	class Index.ProjectTemplateView extends Marionette.Accountant.FilterItemView

		template: 'projects/index/templates/nav/project_template'
		tagName: 'li'
		className: 'icon-button'
		activeSubclassName: 'icon-button--active'
		events:
			'click': 'toggle'
		toggle: ->
			@model.toggleActiveState()
			# notify project models to toggle their display state
			App.vent.trigger 'project:filter:change'

		onShow: ->
			@_disableIfPolicyBrief()

		_disableIfPolicyBrief: ->
			modelId = @model.get 'id'
			@$el.addClass('hidden') if ( modelId is 2 )


	class Index.ProjectTemplatesView extends Marionette.CollectionView

		tagName: 'ul'
		className: 'atl__project-template-filter'
		childView: Index.ProjectTemplateView		

		onShow:
			App.vent.trigger 'project:filter:change'