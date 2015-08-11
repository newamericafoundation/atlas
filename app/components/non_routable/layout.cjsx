Comp.Layout = React.createClass
	
	mixins: [ Comp.Mixins.BackboneEvents ]

	displayName: 'Layout'

	render: ->
		<div className="wrapper">
			<Comp.Setup App={@props.App} />
			<Comp.Header App={@props.App} headerTitle={@props.headerTitle} theme={@props.theme} />
			{ @getRoutable() }
		</div>

	getRoutable: ->
		# Travel down component tree to find routable component.
		return unless @props.routableComponentName?
		compNameKeys = @props.routableComponentName.split('.')
		Component = Comp
		for compNameKey in compNameKeys
			Component = Component[compNameKey]
		<Component App={@props.App} />