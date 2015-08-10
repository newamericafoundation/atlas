Comp = {}

Comp.Mixins = {}

Comp.Icons = {}

# Add Backbone Events to component.
Comp.Mixins.BackboneEvents = {

	componentDidMount: ->
		if _? and Backbone?
			_.extend @, Backbone.Events

	componentWillUnmount: ->
		@stopListening() if @stopListening?

};