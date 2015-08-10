Comp.Projects.Index.ProjectTemplates = React.createClass

	displayName: 'Projects.Index.ProjectTemplates'

	render: ->
		<ul className="atl__project-template-filter">
			{ @_renderList() }
		</ul>

	_renderList: ->
		return unless @props.projectTemplates?
		@props.projectTemplates.map (item, i) =>
			<Comp.Projects.Index.ProjectTemplates.Item App={@props.App} projectTemplate={item} key={i} />


Comp.Projects.Index.ProjectTemplates.Item = React.createClass
	
	displayName: 'Projects.Index.ProjectTemplates.Item'

	render: ->
		projectTemplate = @props.projectTemplate
		<li className={ "icon-button " + @_getModifierClasses() } onClick={@toggleActiveState} >
			<div className={ "icon-button__icon bg-img-#{ @_getIcon() }--black" }></div>
			<p className="icon-button__text">
				{projectTemplate.get('display_name')}
			</p>
		</li>

	_getModifierClasses: ->
		classes = []
		projectTemplate = @props.projectTemplate
		classes.push 'hidden' if projectTemplate.get('id') is '2'
		classes.push 'icon-button--active' if projectTemplate.get('_isActive')
		return '' if classes.length is 0
		return classes.join(' ')

	_getIcon: ->
		templateName = @props.projectTemplate.get('name')
		switch templateName
			when 'Tilemap' then 'map'
			when 'Explainer' then 'dictionary'
			when 'Polling' then 'graph'

	toggleActiveState: ->
		@props.projectTemplate.toggleActiveState()
		App = @props.App
		App.vent.trigger 'project:filter:change' if App?