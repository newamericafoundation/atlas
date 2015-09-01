Comp.BackboneLayout = React.createClass
	
	render: ->
		<div className="wrapper">
			<Comp.Setup App={this.props.App} />
			<Comp.Header App={this.props.App} headerTitle={this.props.headerTitle} theme={this.props.theme} />
			{ this.getRoutable() }
		</div>

	getRoutable: ->
		# Travel down component tree to find routable component.
		return unless this.props.routableComponentName?
		compNameKeys = this.props.routableComponentName.split('.')
		Component = Comp
		for compNameKey in compNameKeys
			Component = Component[compNameKey]
		<Component App={this.props.App} />