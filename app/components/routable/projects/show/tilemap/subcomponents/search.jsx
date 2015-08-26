Comp.Projects.Show.Tilemap.Search = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			searchTerm: ''
		};
	}

	render() {
		return (
			<div className='atl__search'>
				<input type='text' placeholder='Search Project' onChange={ this.setSearchTerm.bind(this) } />
			</div>
		);
	}

	componentWillMount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.reqres.setHandler('search:term', () => { 
			return this.state.searchTerm; 
		});
	}
	
	setSearchTerm(e) {
		this.setState({ searchTerm: e.target.value }, () => {
			var App;
			App = this.props.App;
			if (App == null) { return; }
			App.vent.trigger('search:term:change');
		});
	}

}