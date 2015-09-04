Comp.SideBar = React.createClass

	displayName: 'SideBar'

	render: ->
		cls = if this.state['isActive'] then 'atl__side-bar atl__side-bar--active' else 'atl__side-bar'
		return (
			<div className={cls} onClick={ this.toggle.bind(this) }>
				<div className="atl__side-bar__title">{ this.state['hoveredButtonTitle'] }</div>
				{ this.renderButtons() }
			</div>
		);

	getDefaultProps: ->
		props = 
			buttons: [
				{ 
					title: 'Explore Atlas',
					contentType: 'link',
					method: 'projects', 
					reactIconName: 'Grid', 
					isToggleable: false 
				},
				{ 
					title: 'Collapse/Expand',
					contentType: 'button',
					method: 'collapse', 
					reactIconName: 'Contract', 
					activeReactIconName: 'Expand', 
					isToggleable: false 
				},
				{ 
					title: 'Help',
					contentType: 'button'
					method: 'help', 
					reactIconName: 'Help', 
					isToggleable: false 
				},
				{ 
					title: 'Print',
					contentType: 'button',
					method: 'print', 
					reactIconName: 'Print', 
					isToggleable: false 
				},
				{ 
					title: 'Download Data',
					contentType: 'form',
					url: '/api/v1/projects/print',
					method: 'download',
					reactIconName: 'Download',
					isToggleable: false
				}
			]
		return props

	getInitialState: ->
		return { isActive: false }

	toggle: ->
		this.setState({ isActive: not this.state['isActive'] });

	renderButtons: ->
		list = this.props.buttons.map(this.renderButton);
		return (
			<ul className="atl__side-bar__icons">
				{list}
			</ul>
		);

	renderButton: (options, i) ->
		<li 
			className="atl__side-bar__icon" 
			onMouseEnter={ @onButtonMouseEnter.bind(@, options) } 
			onMouseLeave={ @onButtonMouseLeave.bind(@, options) } 
			onClick={ this.handleClick.bind(this, options) } 
			key={'button-'+i}
		>
			{ @renderButtonContent(options, i) }
		</li>
		
	renderButtonContent: (options, i) ->
		contentType = options.contentType
		if contentType is 'form'
			return @renderButtonFormContent(options)
		if contentType is 'link'
			return @renderButtonLinkContent(options)
		return @renderButtonDefaultContent(options)

	renderButtonDefaultContent: (options) ->
		IconComp = Comp.Icons[options.reactIconName]
		return (
			<div>
				<IconComp />
			</div>
		)

	handleClick: (options) ->
		if @[ '_' + options.method ]?
			@[ '_' + options.method ]()

	renderButtonLinkContent: (options) ->
		IconComp = Comp.Icons[options.reactIconName]
		return (
			<a href={ options.url }>
				<IconComp />
			</a>
		)

	renderButtonFormContent: (options) ->
		atlas_url = @_getAtlasUrl()
		IconComp = Comp.Icons[options.reactIconName]
		return ( 
			<form action={ options.url } method='post'> 
				<IconComp />
				<input type="hidden" name="atlas_url" value={ atlas_url } />
				<input type="submit" value="" />
			</form>
		)

	onButtonMouseEnter: (options) ->
		this.setState({ hoveredButtonTitle: options.title })

	onButtonMouseLeave: (options) ->
		this.setState({ hoveredButtonTitle: '' })

	# Button press method.
	_getAtlasUrl: () ->
		project = this.props.project
		if project?
			atlas_url = project.get 'atlas_url'

	# Button press method.
	_edit: ->
		App = this.props.App
		project = this.props.project
		if App? and project?
			Backbone.history.navigate ''
			url = project.buildUrl()
			window.location.href = url

	# Button press method.
	# 	Expand or collapse. To be renamed.
	_collapse: (e) ->
		if this.props.setUiState?
			this.props.setUiState({ isCollapsedMaster: !this.props.uiState.isCollapsedMaster });

	# Button press method.
	_help: (e) ->
		return unless $?
		$('.atl').toggleClass('atl--help')

	# Button press method.
	_print: ->
		window.print()



# TODO - refactor button logic here, including tracking of active states.
Comp.SideBar.Button = React.createClass

	render: ->
		<li className="atl__side-bar__icon" onMouseEnter={ @onButtonMouseEnter.bind(@, options) } onMouseLeave={ @onButtonMouseLeave.bind(@, options) } onClick={ @[ '_' + options.method ] } key={'button-'+i}>
			{ @renderContent() }
		</li>

	renderContent: ->
		if (this.props.contentType)
			return 1

	renderButtonContent: ->
		<div>
			<IconComp />
		</div>

	renderFormContent: ->
		<form action='/api/v1/projects/print' method='post'> 
			<IconComp />
			<input type="hidden" name="atlas_url" value="atlas_url" />
			<input type="submit" value="" />
		</form>

	renderLinkContent: ->
		<a href='mailto:atlas@newamerica.org'>
			<IconComp />
		</a>