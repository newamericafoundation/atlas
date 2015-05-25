@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	InfoBox.SectionView = Marionette.CompositeView.extend
		tagName: 'li'
		className: 'atl__info-box__item'
		template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/section'


	TocView = Marionette.ItemView.extend
		el: '#atl__toc__list ul'
		events:
			'click a': 'triggerScroll'
		triggerScroll: (e) ->
			App.vent.trigger 'scroll'
		isEmpty: ->
			@$el.html() is ""


	InfoBox.RootView = Marionette.CompositeView.extend

		initialize: ->
			@listenTo App.vent, 'scroll', ->
				@_setStickyNavLayout()

		tagName: 'div'
		className: 'atl__info-box fill-parent'
		template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/root'
		childView: InfoBox.SectionView
		childViewContainer: '#atl__info-box__list'

		events:
			'click #atl__info-box__close': 'purgeView'

		# Get concatenated html of all children.
		getHtml: ->
			html = ""
			@children.each (child) ->
				child.render()
				html += child.el.innerHTML
			html

		onBeforeShow: ->
			@$('.static-content').html(@getHtml())

		onShow: ->
			@_buildToc()
			@_setStickyNavLayout()

		onBeforeDestroy: ->
			@tocView.destroy() if @tocView?

		_setStickyNavLayout: (subClasses) ->
			# TODO - optimize title bar height check so it is not performed all the time
			scrollTop = $('.atl__info-box').scrollTop()
			className = "atl__page-nav"
			$elem = @$(".#{className}")
			if scrollTop > $('.atl__title-bar').height()
				$elem.addClass("#{className}--fixed")
			else
				$elem.removeClass("#{className}--fixed")

		reveal: ->
			$app = $('.atl')
			$app.addClass 'atl__info-box--active'
			$('#atl__map').addClass('blur');
			@

		_buildToc: ->
			$('#atl__toc__list').toc
				selectors: 'h1,h2'
				container: '.static-content'
				templates:
					h2: _.template('<%= title %>')
					h3: _.template('<%= title %>')

			@tocView = new TocView()
			if @tocView.isEmpty()
				$('.atl__toc').hide()

		hide: ->
			$app = $('.atl')
			$app.removeClass 'atl__info-box--active'
			$('#atl__map').removeClass('blur');
			@

		hideAndDestroy: ->
			$app = $('.atl')
			$app.removeClass 'atl__info-box--active'
			$('#atl__map').removeClass('blur');
			$app.one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) =>
				@destroy()
			@

		# Destroys the view through the controller, making sure that the view references are removed.
		purgeView: ->
			InfoBox.Controller.hideAndDestroy()