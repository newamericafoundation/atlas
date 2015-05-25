@Atlas.module 'Projects.Index', (Index, App, Backbone, Marionette, $, _) ->

	class Index.ProjectView extends Marionette.ItemView

		tagName: 'a'
		className: 'atl__project'
		template: 'projects/index/templates/projects/project'

		onShow: ->
			@$el.attr('href', @model.get 'atlas_url')
			@listenTo @model, 'visibility:change', (isVisible) ->
				if isVisible
					@$el.removeClass 'atl__project--hidden'
				else
					@$el.addClass 'atl__project--hidden'

			if @model.get('project_template_id') is 1
				@$el.addClass 'atl__project--explainer'
			if @model.get('is_section_overview') is 'Yes'
				@$el.addClass 'atl__project--overview'

		events:
			'click': 'launchProject'
			'mouseenter': 'applyBackgroundColor'
			'mouseleave': 'removeBackgroundColor'

		launchProject: (e) ->
			e.preventDefault()
			href = @model.get 'atlas_url'
			Backbone.history.navigate href, { trigger: true }

		applyBackgroundColor: ->
			index = @model.collection.indexOf @model
			color = App.CSS.Colors.toRgba index %% 15, 0.8
			@$('.atl__project__text').css('background-color', color)
			App.commands.execute 'set:header:strip:color', color: color

		removeBackgroundColor: ->
			@$('.atl__project__text').css('background-color', '')
			App.commands.execute 'set:header:strip:color', 'none'


	class Index.ProjectsView extends Marionette.CollectionView

		tagName: 'div'
		className: 'atl__projects'
		childView: Index.ProjectView

		initialize: ->
			@listenTo App.vent, 'project:filter:change', @_filterChildren

		onShow: ->
			@_filterChildren()

		_filterChildren: ->
			@collection.filter()