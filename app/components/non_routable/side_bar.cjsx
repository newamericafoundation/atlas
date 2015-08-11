Comp.SideBar = React.createClass

	displayName: 'SideBar'

	mixins: [ Comp.Mixins.BackboneEvents ]

	render: ->
		cls = if @state['isActive'] then 'atl__side-bar atl__side-bar--active' else 'atl__side-bar'
		<div className={cls} onClick={ @toggle }>
			<div className="atl__side-bar__title">{ @state['hoveredButtonTitle'] }</div>
			{ @_renderButtons() }
		</div>

	getDefaultProps: ->
		props = 
			buttons: [
				{ title: 'Explore Atlas', method: 'projects', icon: 'grid', reactIcon: 'Grid', isToggleable: false }
				{ title: 'Collapse/Expand', method: 'collapse', icon: 'contract', reactIcon: 'Collapse', activeReactIcon: 'Expand', isToggleable: false }
				{ title: 'Help', method: 'help', icon: 'help', reactIcon: 'Help', isToggleable: false }
				{ title: 'Print', method: 'print', icon: 'print', reactIcon: 'Print', isToggleable: false }
				{ title: 'Download Data', method: 'download', icon: 'download', reactIcon: 'Download', isToggleable: false }
			]
		return props

	getInitialState: ->
		return { isActive: false }

	toggle: ->
		@setState { isActive: not @state['isActive'] }

	_renderButtons: ->
		list = @props.buttons.map @_renderButton
		<ul className="atl__side-bar__icons">
			{list}
		</ul>

	_renderButton: (options, i) ->
		<li className="atl__side-bar__icon" onMouseEnter={ @onButtonMouseEnter.bind(@, options) } onMouseLeave={ @onButtonMouseLeave.bind(@, options) } onClick={ @[ '_' + options.method ] } key={'button-'+i}>
			{ @_renderButtonContent(options, i) }
		</li>
		
	_renderButtonContent: (options, i) ->
		# custom form button for download case
		IconComp = Comp.Icons[options.reactIcon]
		if options.method is 'download'
			atlas_url = @_getAtlasUrl()
			return <form className="form--compact" action='/api/v1/projects/print' method='post'> 
				<IconComp />
				<input type="hidden" name="atlas_url" value={ atlas_url } />
				<input type="submit" value="" />
			</form>
		# regular case
		else if options.method is 'comment'
			return <a href='mailto:atlas@newamerica.org'>
					<IconComp />
				</a>
		else
			return <div>
					<IconComp />
				</div>

	onButtonMouseEnter: (options) ->
		@setState { hoveredButtonTitle: options.title }

	onButtonMouseLeave: (options) ->
		@setState { hoveredButtonTitle: '' }

	# Button press method.
	_getAtlasUrl: () ->
		project = @props.project
		if project?
			atlas_url = project.get 'atlas_url'

	# Button press method.
	_projects: ->
		Backbone.history.navigate 'menu', { trigger: true } if Backbone?

	# Button press method.
	_edit: ->
		App = @props.App
		project = @props.project
		if App? and project?
			Backbone.history.navigate ''
			url = project.buildUrl()
			window.location.href = url

	# Button press method.
	# 	Expand or collapse. To be renamed.
	_collapse: (e) ->
		App = @props.App
		if App? and $?
			# App.uiState.isCollapsed is highest authority in determining whether
			#   settings bar is expanded or not, but only if there is space.
			# TODO - clean up this complicated logic.
			isCollapsed = App.uiState.isCollapsed or $('.atl').hasClass('atl--collapsed')
			cannotExpand = App.reqres.request('is:settings:bar:overflowing')
			unless (isCollapsed) and (cannotExpand)
				App.uiState.isCollapsed = not App.uiState.isCollapsed
				$('.atl').toggleClass 'atl--collapsed'
				# get icon
				$target = $(e.target)
				if $target.hasClass('atl__side-bar__icon')
					$target = $($target.children()[0])
				$target.toggleClass 'bg-img-expand--off-white'

	# Button press method.
	_help: (e) ->
		$('.atl').toggleClass('atl--help') if $?

	# Button press method.
	_print: ->
		window.print() if window?

	# Button press method.
	_download: ->
		'keep default action'



# TODO - refactor button logic here, including tracking of active states.
Comp.SideBar.Button = React.createClass

	render: ->
		<li className="atl__side-bar__icon" onMouseEnter={ @onButtonMouseEnter.bind(@, options) } onMouseLeave={ @onButtonMouseLeave.bind(@, options) } onClick={ @[ '_' + options.method ] } key={'button-'+i}>
			{ @renderContent() }
		</li>

	renderContent: ->
		<div></div>

	renderRegularContent: ->
		<div></div>

	renderMiniFormContent: ->
		<form>
		</form>

	renderLinkContent: ->
		<a>
		</a>