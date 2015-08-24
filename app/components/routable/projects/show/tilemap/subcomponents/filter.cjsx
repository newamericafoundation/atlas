Comp.Projects.Show.Tilemap.Filter = React.createClass

	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Comp.Projects.Show.Tilemap.Filter'

	render: ->
		<div className='atl__filter'>
			<div id="atl__filter__keys" className="-id-atl__filter__keys">
				<div className="atl__filter__keys">
					<ul>
						{ @renderKeys() }
					</ul>
				</div>
			</div>
			<div id="atl__filter__values" className="-id-atl__filter__values">
				<div className="atl__filter__values">
					<ul>
						{ @renderValues() }
					</ul>
				</div>
			</div>
		</div>

	componentDidMount: ->
		App = @props.App
		if App?
			@listenTo App.vent, 'key:click value:click', @forceUpdate

	renderKeys: ->
		keys = @props.filter.children
		keys.map (key, i) =>
			<Comp.Projects.Show.Tilemap.Filter.Key App={@props.App} filterKey={key} />

	renderValues: ->
		values = @props.filter.getActiveChild().children
		values.map (value, i) =>
			<Comp.Projects.Show.Tilemap.Filter.Value App={@props.App} filterValue={value} />


Comp.Projects.Show.Tilemap.Filter.Key = React.createClass

	displayName: 'Comp.Projects.Show.Tilemap.Filter.Key'

	render: ->
		<li className={ 'button ' + @getModifierClass() } onClick={ @toggle.bind(@) }>
			<p>
				{ @props.filterKey.get('display_title') }
			</p>
		</li>

	getModifierClass: ->
		return 'button--active' if @props.filterKey.isActive()

	toggle: ->
		@props.filterKey.clickToggle()
		App = @props.App
		App.vent.trigger 'key:click' if App?


Comp.Projects.Show.Tilemap.Filter.Value = React.createClass

	displayName: 'Comp.Projects.Show.Tilemap.Filter.Value'

	render: ->
		<li className={ 'toggle-button ' + @getModifierClass() } onClick={ @toggle.bind(@) } onMouseEnter={ @setHovered.bind(this) } onMouseLeave={ @clearHovered.bind(this) } >
			<Comp.Icons.Hex className="toggle-button__icon" colorClassName={ @getColorClass() } />
			<div className="toggle-button__text">
			   	<p>{ @props.filterValue.get('value') }</p>
			</div>
		</li>

	getModifierClass: ->
		siblingsIncludingSelf = @props.filterValue.parent.children
		console.log 
		return 'toggle-button--inactive' unless @props.filterValue.isActive()
		return ''

	getColorClass: ->
		return "bg-c-#{ @props.filterValue.getFriendlySiblingIndex(15) }"

	setHovered: ->
		App = @props.App
		modelIndex = @getFilterValueIndex()
		@props.filterValue.parent.parent.state.valueHoverIndex = modelIndex
		App.vent.trigger 'value:mouseover', modelIndex
		cls = @getColorClass()
		App.commands.execute 'set:header:strip:color', { className: cls }

	clearHovered: ->
		App = @props.App
		@props.filterValue.parent.parent.state.valueHoverIndex = -1
		App.vent.trigger 'value:mouseover'
		App.commands.execute 'set:header:strip:color', 'none'

	getFilterValueIndex: ->
		return @props.filterValue.parent.children.indexOf(@props.filterValue)

	toggle: ->
		@props.filterValue.toggle()
		App = @props.App
		App.vent.trigger 'value:click' if App?