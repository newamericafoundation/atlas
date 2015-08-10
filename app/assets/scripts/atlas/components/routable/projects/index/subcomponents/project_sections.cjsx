Comp.Projects.Index.ProjectSections = React.createClass

	displayName: 'Projects.Index.ProjectSections'

	render: ->
		<ul className="atl__project-section-filter">
			{ @_renderList() }
		</ul>

	_renderList: ->
		return unless @props.projectSections?
		@props.projectSections.map (item, i) =>
			<Comp.Projects.Index.ProjectSections.Item App={@props.App} projectSection={item} key={i} />


Comp.Projects.Index.ProjectSections.Item = React.createClass

	displayName: 'Projects.Index.ProjectSections.Item'

	render: ->
		projectSection = @props.projectSection
		<li className={ "toggle-button toggle-button--black " + @getModifierClass() } onClick={ @toggleActiveState }>
			<Comp.Icons.Hex className={'toggle-button__icon'} />
			<div className="toggle-button__text">
				<p>{projectSection.get('name')}</p>
			</div>
		</li>

	getModifierClass: ->
		if @props.projectSection.get('_isActive') is false
			return 'toggle-button--inactive'
		return ''

	toggleActiveState: ->
		@props.projectSection.toggleActiveState()
		App = @props.App
		App.vent.trigger 'project:filter:change' if App?