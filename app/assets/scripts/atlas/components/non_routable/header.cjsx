Comp.Header = React.createClass

	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Header'

	render: ->
		<div className={ 'header ' + @getBackgroundColorClass() }>
			<div className="header__corner">
				<a className="bg-img-naf--off-white" id="header__welcome-link" href="/welcome" onClick={@navigate} />
			</div>
			<div className="header__main">
				<h1>{ @getHeaderTitle() }</h1>
				<p className="header__main__title"></p>
			</div>
			<Comp.Header.NavCircles App={ @props.App } />
			<div className="header__strip" ref="strip" />
		</div>

	getBackgroundColorClass: ->
		switch @props.theme
			when 'atlas' then 'bg-c-grey--base'
			when 'naf' then 'bg-c-naf-green'
			else ''

	getHeaderTitle: ->
		return unless @props.headerTitle?
		return @props.headerTitle unless @props.headerTitle.toUpperCase?
		return @props.headerTitle.toUpperCase()

	componentDidMount: ->
		@_setStripHandler()

	navigate: (e) ->
		if Backbone?
			e.preventDefault()
			Backbone.history.navigate '/welcome', { trigger: true }

	_setStripHandler: ->
		App = @props.App
		stripClassName = 'header__strip'
		if App? and $?
			$strip = $ React.findDOMNode(@refs.strip)
			App.commands.setHandler 'set:header:strip:color', (options) =>
				if (not options?) or (options is 'none')
					$strip.attr 'class', stripClassName
					$strip.css 'background-color', ''
				else if options.color?
					# reset class to original
					$strip.attr 'class', stripClassName
					$strip.css 'background-color', options.color
				else if options.className?
					# erase all previously assigned color setting classes
					$strip.css 'background-color', ''
					$strip.attr 'class', stripClassName
					$strip.addClass options.className


Comp.Header.NavCircles = React.createClass
	
	displayName: 'Header.NavCircles'

	mixins: [ Comp.Mixins.BackboneEvents ]

	render: ->
		<div className="header__nav-circles">
			<ul className="nav-circles">
				{ @renderList() }
			</ul>
		</div>

	renderList: ->
		[ 'welcome', 'menu', 'show' ].map (item, i) =>
			cls = if (i is @state['activeIndex']) then ('nav-circle nav-circle--active') else ('nav-circle')
			<li className={cls} key={i}>
				<a href={ '/' + item } onClick={ @navigate } />
			</li>

	componentDidMount: ->
		App = @props.App
		if App? and @listenTo?
			@listenTo App.vent, 'router:current:action:change', (index) ->
				@setState { activeIndex: index }

	navigate: (e) ->
		e.preventDefault()
		$target = $(e.target)
		App = @props.App
		if App?
			App.router.navigate $target.attr('href')

	getInitialState: ->
		return { activeIndex: 0 }