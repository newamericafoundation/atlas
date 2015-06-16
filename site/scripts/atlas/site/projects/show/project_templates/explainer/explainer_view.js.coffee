@Atlas.module 'Projects.Show.Explainer', (Explainer, App, Backbone, Marionette, $, _) ->

	Explainer.RelatedPageView = Marionette.ItemView.extend
		tagName: 'li'
		className: ''
		template: 'projects/show/project_templates/explainer/templates/related_page'


	Explainer.RelatedPagesView = Marionette.CompositeView.extend

		initialize: ->
			@listenTo @collection, 'reset', =>
				@$el.show() if @collection.length > 0

		tagName: 'div'
		className: 'atl__related'
		template: 'projects/show/project_templates/explainer/templates/related_pages'
		childView: Explainer.RelatedPageView
		childViewContainer: 'ul'

		onShow: ->
			@$el.hide()


	TocView = Marionette.ItemView.extend
		events:
			'click a': 'triggerScroll'
		triggerScroll: (e) ->
			App.vent.trigger 'scroll'
		isEmpty: ->
			@$el.html() is ""


	Explainer.RootView = Marionette.LayoutView.extend

		initialize: ->
			@listenTo App.vent, 'scroll', ->
				@_setStickyNavLayout()

		tagName: 'div'
		className: 'fill-parent'
		template: 'projects/show/project_templates/explainer/templates/root'
		
		regions:
			toc: '#atl__toc'
			related: '#atl__related'
			content: '#atl__content'

		onShow: ->
			@_processAtlasCharts()
			@_buildToc()
			@_setStickyNavLayout()
			@_setThemeColor()

		onBeforeDestroy: ->
			@chartManager.destroy() if @chartManager?
			@tocView.destroy() if @tocView?

		_setThemeColor: ->
			$bg = @$('.atl__title-bar__background')
			color = App.currentThemeColor
			if color?
				$bg.css('background-color', color)

		_setStickyNavLayout: (subClasses) ->
			# TODO - optimize title bar height check so it is not performed all the time
			scrollTop = $('#atl__main').scrollTop()
			className = "atl__page-nav"
			$elem = @$(".#{className}")
			if scrollTop > $('.atl__title-bar').height()
				$elem.addClass("#{className}--fixed")
			else
				$elem.removeClass("#{className}--fixed")

		_processAtlasCharts: ->
			if ChartistHtml?
				@chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'))
				@chartManager.render()

		_buildToc: ->
			@$('#atl__toc__list').toc
				selectors: 'h1,h2'
				container: '.static-content'
				templates:
					h2: _.template('<%= title %>')
					h3: _.template('<%= title %>')
				smoothScrolling: (target, options, callback) ->
					$(target).smoothScroll();

			@tocView = new TocView
				el: $('#atl__toc__list ul')
			if @tocView.isEmpty()
				$('.atl__toc').hide()