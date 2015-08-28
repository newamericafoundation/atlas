Comp.Setup = React.createClass
	
	displayName: 'Setup'

	render: ->
		App = @props.App
		<div className="atl__setup">
			<svg id="patterns">
				<Comp.Setup.Patterns App={App} size={30} />
			</svg>
		</div>

# Component that defines the color combination patterns needed for 
#   multi-colored striped fill on SVG elements.
Comp.Setup.Patterns = React.createClass
	
	displayName: 'Setup.Patterns'

	mixins: [ Comp.Mixins.BackboneEvents ]

	render: ->
		<defs>
			{@renderList()}
		</defs>

	getInitialState: ->
		{ data: [] }

	renderList: ->
		# Need to start with a set number of empty patterns and modify as new patterns are requested.
		#   it does not work when they are generated from scratch on the fly.
		# @state.data.map (colorCodes, id) =>
		for i in [0...this.props.size] by 1
			colorCodes = @state.data[i]
			<Comp.Setup.Pattern App={@props.App} id={i} key={i} colorCodes={colorCodes} />

	componentDidMount: ->
		App = @props.App
		if App?
			App.commands.setHandler 'reset:patterns', @resetPatterns.bind(@)
			App.reqres.setHandler 'get:pattern:id', @ensureAndGetPattern.bind(@)

	componentWillUnmount: ->
		App = @props.App
		App.commands.clearHandler 'reset:patterns'

	resetPatterns: ->
		@setState { data: [] }

	# Ensures a pattern is defined and returns its id.
	# @param {array} colorCodes
	# @returns {number} id
	ensureAndGetPattern: (colorCodes) ->
		# Loop through existing patterns to see if the combination has been defined before.
		for existingColorCodes, i in @state.data
			if colorCodes.join('-') is existingColorCodes.join('-')
				return i
		# If the pattern is not found, define it on the fly.
		data = this.state.data
		# If the size is exceeded, erase all patterns (suboptimal).
		if (data.length > this.props.size - 2)
			data = []
		data.push colorCodes
		@setState { data: data }
		# Return the index of the newly defined color code.
		return @state.data.length-1

	# These are the readily assembled pattern templates are assembled programatically by the child component.
	__testRenderTwoColorPattern: ->
		<pattern id="diagonal-stripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
		    <rect x="0" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'roed' };"} />
		    <rect x="2" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'roed' };"} />
		    <rect x="4" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'hvid' };"} />
		    <rect x="6" y="0" width="2" height="8" style={"stroke:none; fill:#{ 'hvid' };"} />
		</pattern>

	__testRenderThreeColorPattern: ->
		<pattern id="diagonal-stripes" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
		  	<rect  x="0" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'schwarz' };"} />
		    <rect  x="6" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'rot' };"} />
		    <rect x="12" y="0" width="6" height="18" style={"stroke:none; fill:#{ 'gold' };"} />
		</pattern>


# Single pattern element.
Comp.Setup.Pattern = React.createClass
	
	displayName: 'Setup.Pattern'

	render: ->
		return <pattern /> unless @props.colorCodes?
		colorCount = @props.colorCodes.length
		dim = if colorCount is 2 then 12 else 18
		className = 'striped-pattern-' + @props.colorCodes.join('-')
		<pattern id={'stripe-pattern-' + @props.id} className={className} x="0" y ="0" width={dim} height={dim} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
			{@_getPatternRects()}
		</pattern>

	# Custom color function that translates a color code into an rgb value.
	# TODO: this function needs to be provided as props to the parent component.
	#   this will make the component more general.
	getColor: (colorCode) ->
		App = @props.App
		return App.CSS.Colors.toRgb(colorCode - 1) if App?

	componentDidMount: ->
		@setPatternTransform()

	componentDidUpdate: ->
		@setPatternTransform()

	# React does not support patternTransform as an attribute.
	#   Need to set with vanilla JavaScript instead (jQuery lowercases it by default).
	setPatternTransform: ->
		React.findDOMNode(@).setAttribute('patternTransform', 'rotate(45)')

	# @param {number} n - Number of rectangles defining the pattern.
	_getPatternRects: (n) ->
		return if not @props.colorCodes?
		n = @props.colorCodes.length
		[0...n].map (i) =>
			height = if n is 2 then 12 else 18
			color = @getColor @props.colorCodes[i]
			style = { 'stroke': 'none', 'fill': color }
			<rect key={i} x={6 * i} y="0" width="6" height={height} style={style} />