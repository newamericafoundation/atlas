Comp.Projects.Show.Explainer = React.createClass

	displayName: 'Projects.Show.Explainer'

	render: ->
		<div className="fill-parent">
			<div className="atl__title-bar atl__title-bar--solid bg-c-off-white" ref='title-bar'>
				<div className="atl__title-bar__background" ref='title-bar__background'></div>
				<div className="atl__title-bar__content">
					<h1 className='title'>{ @_getTitle() }</h1>
					<ul>
						<li>Updated: { @_getUpdateMoment() }</li>
					</ul>
				</div>
			</div>
			<div className="atl__content-bar bg-c-off-white"> 
				<div className="atl-grid">
					<div className="atl-grid__1-3">
						<div className="atl__page-nav" ref="page-nav">
							{ @_renderToc() }
						</div>
					</div>
					<div className="atl-grid__2-3">
						<div className="static-content" dangerouslySetInnerHTML={{ __html: @_getBodyText() }}>
						</div>
						<Comp.Projects.Show.Explainer.Related related={@props.related} />
					</div>
					<div className="atl-grid__3-3"></div>
				</div>
			</div>
		</div>

	componentDidMount: ->
		@_buildAtlasCharts()
		@_setStickyNavLayout()
		@_onScroll()
		@_setThemeColor()

	componentWillUnmount: ->
		@_destroyAtlasCharts()
		@_offScroll()

	_getTitle: ->
		title = if @props.project? then @props.project.get('title') else ''
		title

	_getBodyText: ->
		bodyText = if @props.project? then @props.project.get('body_text') else ''
		bodyText

	_renderToc: ->
		tocItems = @props.project.get('body_text_toc')
		return unless (tocItems? and tocItems.map? and tocItems.length > 0)
		renderedList = tocItems.map (item, i) =>
			<li className={'toc-'+item.tagName} key={'toc-' + i}>
				<a href={"#toc-"+item.id}>
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

	_renderRelated: ->
		relatedItems = @props.related
		return unless (relatedItems? and relatedItems.map? and relatedItems.length > 0)
		renderedList = relatedItems.map (item, i) ->
			<li key={'related-' + i}>
				<a className="link" href={"/" + item.get('atlas_url')}>{item.get('title')}</a>
			</li>
		<div className="atl__related">
			<p>Related Pages</p>
			<ul>
				{ renderedList }
			</ul>
		</div>

	_getUpdateMoment: ->
		if moment?
			return moment(@props.project.get('updated_at')).format("MMMM Do YYYY")

	_buildAtlasCharts: ->
		if ChartistHtml? and $?
			@chartManager = new ChartistHtml.ChartCollectionManager($('.atlas-chart'))
			@chartManager.render()

	_destroyAtlasCharts: ->
		@chartManager.destroy() if @chartManager?

	_setStickyNavLayout: (subClasses) ->
		if $?
			# TODO - optimize title bar height check so it is not performed all the time
			scrollTop = $('#atl__main').scrollTop()
			className = "atl__page-nav"
			$elem = $(React.findDOMNode(@refs['page-nav']))
			if scrollTop > @_getTitleBarHeight()
				$elem.addClass("#{className}--fixed")
			else
				$elem.removeClass("#{className}--fixed")

	# Get title bar
	_getTitleBarHeight: ->
		unless @_titleBarHeightCache? and (@_titleBarHeightCache > 0)
			$el = $ React.findDOMNode(@refs['title-bar'])
			@_titleBarHeightCache = $el.height()
		return @_titleBarHeightCache

	_onScroll: () ->
		App = @props.App
		if App?
			App.vent.on 'scroll', @_setStickyNavLayout

	_offScroll: () ->
		App = @props.App
		if App?
			App.vent.off 'scroll', @_setStickyNavLayout

	_setThemeColor: () ->
		App = @props.App
		if $? and App?
			$bg = $(React.findDOMNode(@refs['title-bar__background']))
			color = App.currentThemeColor
			if color?
				$bg.css('background-color', color)