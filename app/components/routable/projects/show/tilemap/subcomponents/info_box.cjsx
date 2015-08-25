Comp.Projects.Show.Tilemap.InfoBox = React.createClass

	mixins: [ Comp.Mixins.BackboneEvents ]

	getInitialState: ->
		{
			transitionEventNamespace: 0
		}

	render: ->
		<div className="atl__info-box" ref='main'>
			<a href="#" className="bg-img-no--black atl__info-box__close" onClick={ @close }></a>
			<div className="atl__title-bar atl__title-bar--image bg-c-off-white">
				<div className="atl__title-bar__background"></div>
				<div className="atl__title-bar__content">
					<h1 className='title'>{ @getTitle() }</h1>
					<ul>
						{ @renderWebsite() }
					</ul>
				</div>
			</div>
			<div className="atl__content-bar bg-c-off-white">
				<div className="atl-grid">
					<div className="atl-grid__1-3">
						<div className="atl__page-nav">
							<div className="atl__toc">
								<p>Page Contents</p>
								<div id="atl__toc__list"></div>
							</div>
							<div id="atl__related"></div>
						</div>
					</div>
					<div className="atl-grid__2-3">
						<Comp.Projects.Show.Tilemap.InfoBox.Content {...@props} />
					</div>
					<div className="atl-grid__3-3">
					</div>
				</div>
			</div>
		</div>

	componentWillMount: ->
		App = @props.App
		if App?
			@listenTo App.vent, 'item:activate', =>
				@props.setUiState({ isInfoBoxActive: true })

	componentDidUpdate: ->
		App = @props.App
		if App?
			@setImage()

	getTitle: ->
		project = @props.project
		activeItem = project.get('data').items.active
		return activeItem.get('name') if activeItem?
		return project.get('title')

	getBodyHtml: ->
		project = @props.project
		activeItem = project.get('data').items.active
		return '<p>Active Data Html</p>' if activeItem?
		return project.get('body_text')

	close: (e) ->
		e.preventDefault()
		transitionEventName = @getTransitionEventName()
		$el = $(React.findDOMNode(@refs.main))
		$el.on transitionEventName, (e) =>
			App.vent.trigger 'item:deactivate'
			$(@).off transitionEventName

		@props.setUiState({ isInfoBoxActive: false })
		App = @props.App
		
	# Get a list of transition event names.
	# Each event is namespaced with an incremental id so that the same events are not reattached over and over again.
	getTransitionEventName: () ->
		events = [ 'webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend' ]
		@setState { transitionEventNamespace: this.state.transitionEventNamespace + 1 }
		eventName = events.map((event) => return "event.#{this.state.transitionEventNamespace}" ).join(' ')
		eventName

	# Set background image.
	setImage: () ->
		project = @props.project
		App = @props.App
		activeItem = project.get('data').items.active
		return unless activeItem?
		$el = $('.atl__title-bar__background')
		$el.css('background-color', 'rgba(50, 50, 50, 0.1)')
		imageName = activeItem.getImageName()
		if imageName?
			img = App.reqres.request 'image:entity', { name: imageName }
			img.on 'sync', =>
				backgroundImageCss = img.getBackgroundImageCss()
				if backgroundImageCss?
					$el.css('background-color', 'initial')
					$el.css('background-image', backgroundImageCss)
					# @_appendImageAttribution(img.getAttributionHtml())


	renderWebsite: ->
		<li>
			<a className="icon-button" href="<%= website %>" target="_blank">
				<div className="icon-button__icon bg-img-link--black"></div>
				<div className="icon-button__text">Website</div>
			</a>
		</li>

	


Comp.Projects.Show.Tilemap.InfoBox.Content = React.createClass

	render: ->
		project = @props.project
		activeItem = @props.activeItem
		html = if activeItem? then @getContentHtml() else project.get('body_text')
		<div className='static-content' dangerouslySetInnerHTML={{ __html: html }}></div>

	getContentHtml: ->
		project = @props.project

		App = @props.App

		# Converts a section entry (field of an item) to html.
	    # Supports markdown.
		getSectionHtml = (raw) ->
			# do not process if already broken down to an array
			#   based on | separation character
			return raw if (not raw?) or _.isArray(raw)
			# convert to string if number
			return raw.toString() if _.isNumber(raw)
			# convert to markdown
			html = marked(raw)
			formatters = App.Util.formatters
			formatters.htmlToHtml(html)

		activeItem = @props.activeItem

		infoBoxSections = project.get('data').infobox_variables
		variables = project.get('data').variables

		html = ""

		infoBoxSections.getItemSections(activeItem, variables).forEach (section) =>
			html += "<h1>#{section.variable.get('display_title')}</h1>#{getSectionHtml(section.field)}"

		html

	componentDidMount: ->
		$('#atl__toc__list').toc
			selectors: 'h1,h2'
			container: '.static-content'
			templates:
				h2: _.template('<%= title %>')
				h3: _.template('<%= title %>')