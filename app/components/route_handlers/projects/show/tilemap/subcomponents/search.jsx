import React from 'react';
import classNames from 'classnames';
import { No } from './../../../../../general/icons.jsx';

class Search extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__search'>
				<a href='#' className='atl__search__close' onClick={ this.close.bind(this) }>
					<No />
				</a>
				<form onSubmit={ this.close.bind(this) }>
					<input 
						type='text' 
						placeholder='Search Project' 
						autofocus={true}
						value={ this.props.uiState.searchTerm }
						onChange={ this.setSearchTerm.bind(this) } 
					/>
				</form>
			</div>
		);
	}
	

	/*
	 *
	 *
	 */
	setSearchTerm(e) {
		this.props.setUiState({ searchTerm: e.target.value });
	}


	/*
	 *
	 *
	 */
	close(e) {
		if (e) { e.preventDefault(); }
		this.props.setUiState({ isSearchBarActive: false });
	}

}

export default Search;