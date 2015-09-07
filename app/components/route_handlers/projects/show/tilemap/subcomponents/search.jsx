import React from 'react';
import classNames from 'classnames';

class Search extends React.Component {

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

	componentWillUnmount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.reqres.removeHandler('search:term');
	}
	
	setSearchTerm(e) {
		this.setState({ searchTerm: e.target.value }, () => {
			var App;
			App = this.props.App;
			if (App == null) { return; }
			App.commands.execute('update:tilemap');
		});
	}

}

export default Search;