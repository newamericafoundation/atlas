Comp.Projects.Show.Tilemap = React.createClass
	
	displayName: 'Comp.Projects.Show.Tilemap'

	render: ->
		
		return <div id="atl__main__temp" className="fill-parent"></div>

		<div className='atl__main fill-parent'>
			<Comp.Projects.Show.Tilemap.Map App={@props.App} project={@props.project} />
			
			<div className="atl__base-layer"></div>
			<div className="atl__settings-bar">
				<Comp.Projects.Show.Tilemap.Headline App={@props.App} project={@props.project} />
				<Comp.Projects.Show.Tilemap.Search App={@props.App} project={@props.project} />
				<Comp.Projects.Show.Tilemap.Filter App={@props.App} filter={ @getFilter() } />
			</div>

			<Comp.Projects.Show.Tilemap.Legend App={@props.App} filter={ @getFilter() } />
			<Comp.Projects.Show.Tilemap.Info App={@props.App} project={@props.project} />
			<Comp.Projects.Show.Tilemap.Popup App={@props.App} project={@props.project} />
			<Comp.Projects.Show.Tilemap.InfoBox App={@props.App} project={@props.project} />
		</div>

	getFilter: ->
		@props.project.get('data').filter

	componentDidMount: ->
		App = @props.App
		return unless App?
		App.Tilemap.start()

	componentWillUnmount: ->
		App = @props.App
		return unless App?
		App.Tilemap.stop()