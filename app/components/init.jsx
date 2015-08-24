// Initialize components namespace.
var Comp = {};

Comp.Mixins = {};

Comp.Icons = {};

// Add Backbone Events to component.
Comp.Mixins.BackboneEvents = {

	componentWillMount: function() {
		if (_ && Backbone) {
			_.extend(this, Backbone.Events);
		}
	},
		
	componentWillUnmount: function() {
		if (this.stopListening) {
			this.stopListening();
		}
	}
		
};