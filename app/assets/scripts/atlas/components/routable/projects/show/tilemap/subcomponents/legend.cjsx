Comp.Projects.Show.Tilemap.Legend = React.createClass

	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Comp.Projects.Show.Tilemap.Legend'

	render: ->
		<div className="atl__legend">
			<ul className="legend-icons">
				{ @renderList() }
			</ul>
		</div>

	renderList: ->
		@props.filter.getActiveChild().children.map (filterValue) =>
			<Comp.Projects.Show.Tilemap.Legend.Icon filterValue={filterValue} App={@props.App} />


Comp.Projects.Show.Tilemap.Legend.Icon = React.createClass
	
	mixins: [ Comp.Mixins.BackboneEvents ]
	
	displayName: 'Comp.Projects.Show.Tilemap.Legend.Icon'

	render: ->
		<li className={ @getClass() } onClick={ @toggle.bind(@) }>
			<Comp.Icons.Hex className={ '' } colorClassName={ @getColorClass() } />
		</li>

	getClass: ->
		base = 'atl__legend__icon'
		cls = base
		cls += if @props.filterValue.isActive() then '' else ' ' + base + '--inactive'
		cls

	getColorClass: ->
		return "bg-c-#{@props.filterValue.getFriendlySiblingIndex(15)}"

	toggle: ->
		@props.filterValue.toggle()
		App = @props.App
		App.vent.trigger 'value:click' if App?