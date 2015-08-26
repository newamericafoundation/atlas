Comp.Projects.Show.Explainer = React.createClass

	displayName: 'Projects.Show.Explainer'

	render: ->
		<div className="atl__main fill-parent">
			<div className="atl__title-bar atl__title-bar--solid bg-c-off-white" ref='title-bar'>
				<div className="atl__title-bar__background" ref='title-bar__background'></div>
				<div className="atl__title-bar__content">
					<h1 className='title'>{ @getTitle() }</h1>
					<ul>
						<li>Updated: { @getUpdateMoment() }</li>
					</ul>
				</div>
			</div>
			<div className="atl__content-bar bg-c-off-white"> 
				<div className="atl-grid">
					<div className="atl-grid__1-3">
						<div className="atl__page-nav" ref="page-nav">
							{ @renderToc() }
						</div>
					</div>
					<div className="atl-grid__2-3">
						<div className="static-content" dangerouslySetInnerHTML={{ __html: @getBodyText() }}>
						</div>
						<Comp.Projects.Show.Explainer.Related related={@props.related} />
					</div>
					<div className="atl-grid__3-3"></div>
				</div>
			</div>
		</div>

	renderToc: ->
		tocItems = @props.project.get('body_text_toc')
		return unless (tocItems? and tocItems.map? and tocItems.length > 0)
		renderedList = tocItems.map (item, i) =>
			<li className={'toc-'+item.tagName} key={'toc-' + i}>
				<a href={"#toc-"+item.id} onClick={ this.triggerScrollAfterDelay.bind(this) } >
					{ item.content }
				</a>
			</li>
		<div className="atl__toc">
			<p>Page Contents</p>
			<div id="atl__toc__list">
				<ul>
					{ renderedList }
				</ul>
			</div>
		</div>

	componentDidMount: ->
		@buildAtlasCharts()
		@setStickyNavLayout()
		@onScroll()
		@setThemeColor()

	componentWillUnmount: ->
		@destroyAtlasCharts()
		@offScroll()

	getTitle: ->
		title = if @props.project? then @props.project.get('title') else ''
		title

	getBodyText: ->
		bodyText = if @props.project? then @props.project.get('body_text') else ''
		bodyText

	getUpdateMoment: ->
		if moment?
			return moment(@props.project.get('updated_at')).format("MMMM Do YYYY")

	# When a table of contents item is clicked, the sticky scroll layout code is not invoked.
	#   To fix this, an extra scroll event is triggered after every click
	#   to make sure the new scroll position is reached.
	triggerScrollAfterDelay: ->
		App = @props.App
		return unless App?
		fn = -> App.vent.trigger('scroll')
		setTimeout fn, 75

	buildAtlasCharts: ->
		if ChartistHtml? and $?
			@chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'))
			@chartManager.render()

	destroyAtlasCharts: ->
		@chartManager.destroy() if @chartManager?

	setStickyNavLayout: (subClasses) ->
		if $?
			# TODO - optimize title bar height check so it is not performed all the time
			scrollTop = $('.atl__main').scrollTop()
			className = "atl__page-nav"
			$elem = $(React.findDOMNode(@refs['page-nav']))
			if scrollTop > @getTitleBarHeight()
				$elem.addClass("#{className}--fixed")
			else
				$elem.removeClass("#{className}--fixed")

	# Get title bar height.
	getTitleBarHeight: ->
		unless @_titleBarHeightCache? and (@_titleBarHeightCache > 0)
			$el = $ React.findDOMNode(@refs['title-bar'])
			@_titleBarHeightCache = $el.height()
		return @_titleBarHeightCache

	onScroll: () ->
		App = @props.App
		if App?
			App.vent.on 'scroll', @setStickyNavLayout

	offScroll: () ->
		App = @props.App
		if App?
			App.vent.off 'scroll', @setStickyNavLayout

	setThemeColor: () ->
		App = @props.App
		if $? and App?
			$bg = $(React.findDOMNode(@refs['title-bar__background']))
			color = App.currentThemeColor
			if color?
				$bg.css('background-color', color)