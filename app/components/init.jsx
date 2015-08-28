// Initialize components namespace.
var Comp = {};

Comp.Mixins = {};

Comp.Icons = {};

Comp.Projects = {};

// Render a help text segment that displays when help is activated.
// Parent needs to be relatively positioned for this to work.
Comp.Help = class extends React.Component {

	render() {
		var modifierClass = (this.props.position) ? `atl__help--${this.props.position}` : '',
			id = this.props.id ? `atl__help__${this.props.id}` : undefined;
		return (
			<div className={ 'atl__help ' + modifierClass } id={ id } >
				{ this.props.text }
			</div>
		);
	}

}

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