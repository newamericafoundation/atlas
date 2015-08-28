Comp.Projects.Show.Tilemap.InfoBox = React.createClass

	getInitialState: ->
		{
			transitionEventNamespace: 0
		}

	render: ->
		content = @getContent()
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
								<div id="atl__toc__list">
									{ @renderTocList() }
								</div>
							</div>
							<div id="atl__related"></div>
						</div>
					</div>
					<div className="atl-grid__2-3">
						<div className='static-content' dangerouslySetInnerHTML={{ __html: content.body }}></div>
					</div>
					<div className="atl-grid__3-3">
					</div>
				</div>
			</div>
		</div>

	shouldComponentUpdate: (nextProps) ->
		return (@props.activeItem isnt nextProps.activeItem)

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

	# Close popup.
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
		$el = $('.atl__title-bar__background')
		$el.css('background-color', 'rgba(50, 50, 50, 0.1)')
		$el.css('background-image', '')
		project = @props.project
		App = @props.App
		activeItem = project.get('data').items.active
		return unless activeItem?
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

	getContent: ->
		body = ''
		toc = ''
		project = @props.project
		activeItem = @props.activeItem
		if activeItem?
			@ensureActiveItemContent()
			body = activeItem.get('info_box_content')
			toc = activeItem.get('info_box_content_toc')
		else
			body = project.get('body_text')
			toc = project.get('body_text_toc')
		cntnt = 
			body: body
			toc: toc

	renderTocList: ->
		tocItems = @getContent().toc
		return unless (tocItems? and tocItems.map? and tocItems.length > 0)
		renderedList = tocItems.map (item, i) =>
			<li className={'toc-'+item.tagName} key={'toc-' + i}>
				<a href={"#toc-"+item.id} onClick={ this.triggerScrollAfterDelay.bind(this) } >
					{ item.content }
				</a>
			</li>

	# When a table of contents item is clicked, the sticky scroll layout code is not invoked.
	#   To fix this, an extra scroll event is triggered after every click
	#   to make sure the new scroll position is reached.
	triggerScrollAfterDelay: ->
		App = @props.App
		return unless App?
		fn = -> App.vent.trigger('scroll')
		setTimeout fn, 75

	ensureActiveItemContent: ->
		project = @props.project
		App = @props.App
		activeItem = @props.activeItem
		# if there is no active item or its content is already set, return
		return if (not activeItem? or activeItem.get('info_box_content')?)
		variables = project.get('data').variables
		infoBoxVar = variables.filter (variable) ->
			variable.get('infobox_order')?
		infoBoxVar.sort (a, b) ->
			a.get('infobox_order') > b.get('infobox_order')
		html = ""
		infoBoxVar.forEach (variable) =>
			html += "<h1>#{variable.get('display_title')}</h1>#{variable.getFormattedField(activeItem)}"
		activeItem.set('info_box_content', html)
		activeItem.setHtmlToc('info_box_content')