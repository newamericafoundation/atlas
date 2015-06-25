@Atlas.module 'Projects.Show.Tilemap.InfoBox', (InfoBox, App, Backbone, Marionette, $, _) ->

	InfoBox.SectionView = Marionette.CompositeView.extend
		tagName: 'li'
		className: 'atl__info-box__item'
		template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/section'

	# toc = table of contents
	TocView = Marionette.ItemView.extend
		events:
			'click a': 'triggerScroll'
		triggerScroll: (e) ->
			App.vent.trigger 'scroll'
		isEmpty: ->
			# If there is one or no toc item, the toc is considered empty.
			@$el.children().length < 2


	InfoBox.RootView = Marionette.ItemView.extend

		initialize: ->
			@listenTo App.vent, 'scroll', ->
				@_setStickyNavLayout()

		tagName: 'div'
		className: 'atl__info-box fill-parent'
		template: 'projects/show/project_templates/tilemap/submodules/info_box/templates/root'

		events:
			'click .atl__info-box__close': 'purgeView'

		templateHelpers: App.Util.formatters

		# Get concatenated html of all children.
		getCollectionHtml: ->
			if @collection?
				html = ""
				@collection.each (model) =>
					view = new InfoBox.SectionView
						model: model
					view.render()
					html += view.el.innerHTML
				html

		onRender: ->
			@$('.static-content').html(@getCollectionHtml())
			@_buildToc()
			@_setStickyNavLayout()
			@_setImage()
			@_setThemeBackground() unless @collection?

		onBeforeDestroy: ->
			@attributionView.destroy() if @attributionView?
			@tocView.destroy() if @tocView?

		reveal: ->
			$app = $('.atl')
			$app.addClass 'atl__info-box--active'
			@

		hide: ->
			$app = $('.atl')
			$app.removeClass 'atl__info-box--active'
			@

		hideAndDestroy: ->
			$app = $('.atl')
			$app.removeClass 'atl__info-box--active'
			$app.one 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', (e) =>
				@destroy()
			@

		# Destroys the view through the controller, making sure that the view references are removed.
		purgeView: ->
			InfoBox.Controller.hide()

		showAttributionLink: (e) ->
			$(e.target).toggleClass 'atl__attribution--active'

		# Build table of contents.
		_buildToc: ->
			$('#atl__toc__list').toc
				selectors: 'h1,h2'
				container: '.static-content'
				templates:
					h2: _.template('<%= title %>')
					h3: _.template('<%= title %>')

			@tocView = new TocView
				el: $('#atl__toc__list ul')

			if @tocView.isEmpty()
				$('.atl__toc').hide()

		# 
		_setStickyNavLayout: (subClasses) ->
			# TODO - optimize title bar height check so it is not performed all the time
			scrollTop = $('.atl__info-box').scrollTop()
			className = "atl__page-nav"
			$elem = @$(".#{className}")
			if scrollTop > $('.atl__title-bar').height()
				$elem.addClass("#{className}--fixed")
			else
				$elem.removeClass("#{className}--fixed")

		_setImage: () ->
			$el = @$('.atl__title-bar__background')
			$el.css('background-color', 'rgba(50, 50, 50, 0.1)')
			return unless (@model?) and (@model.getImageName?)
			imageName = @model.getImageName()
			if imageName?
				img = App.reqres.request 'image:entity', { name: imageName }
				img.on 'sync', =>
					backgroundImageCss = img.getBackgroundImageCss()

					if backgroundImageCss?
						$el.css('background-color', 'initial')
						$el.css('background-image', backgroundImageCss)

						@_appendImageAttribution(img.getAttributionHtml())
						

		_appendImageAttribution: (html) ->
			view = new App.Base.AttributionView
				model: new Backbone.Model({ linkHtml: html })
			view.render()
			$('.atl__title-bar').append(view.$el)
			@attributionView = view


		_setThemeBackground: () ->
			$titleBar = @$('.atl__title-bar')
			$bg = @$('.atl__title-bar__background')
			$titleBar.removeClass 'atl__title-bar--image'
			$titleBar.addClass 'atl__title-bar--solid'
			color = App.currentThemeColor
			if color?
				$bg.css('background-color', color)
			else
				$bg.css('background-color', '')