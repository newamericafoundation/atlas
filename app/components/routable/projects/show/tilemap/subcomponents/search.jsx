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

	componentDidMount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.reqres.setHandler('search:term', () => { return this.state.searchTerm; });
	}
	
	setSearchTerm(e) {
		console.log(e.target.value.length);
		var App = this.props.App;
		if (App == null) { return; }
		this.setState({
			searchTerm: e.target.value
		});
		App.vent.trigger('search:term:change');
	}

}