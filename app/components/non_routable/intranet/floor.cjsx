# Floor plan component.
Comp.Floor = React.createClass

	render: ->
		<svg className='floor' id={ @getId() }>
			<polygon className='floor__plan' points={ @getPoints() } />
			<g className='floor__rooms'>
				{ @renderRooms() }
			</g>
		</svg>

	renderRooms: ->
		@props.plan.rooms.map (room) ->
			<Comp.Floor.Room plan={room} />

	getId: ->
		'floor-' + @props.plan.name.replace(/\s+/g, '')

	getPoints: ->
		coord = @props.plan.coordinates
		points = coord.map (pointArray) ->
			pointArray.join(',')
		points.join(',')


# Room component within floor plan.
Comp.Floor.Room = React.createClass

	render: ->
		<polygon className={ 'floor__room' } points={ @getPoints() } onClick={ @activate } onMouseEnter={ @log } />

	getModifierClass: ->
		if @state.isActive then 'floor__room--active' else ''

	getInitialState: ->
		{ isActive: false }

	getPoints: ->
		coord = @props.plan.coordinates
		points = coord.map (pointArray) ->
			pointArray.join(',')
		points.join(',')

	log: ->
		console.log 'welcome to room ' + @props.plan.name

