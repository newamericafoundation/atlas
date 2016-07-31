import React from 'react'
import classNames from 'classnames'

import { No } from './../../../../../general/icons.jsx'
import Base from './base.jsx'


/*
 * Search bar.
 *
 */
class Search extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.setSearchTerm = this.setSearchTerm.bind(this)
		this.close = this.close.bind(this)
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__search'>
				<a href='#' className='atl__search__close' onClick={ this.close }>
					<No />
				</a>
				<form onSubmit={ this.close }>
					<input 
						type='text' 
						placeholder='Search Project' 
						autofocus={true}
						value={ this.props.uiState.searchTerm }
						onChange={ this.setSearchTerm } 
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
		this.props.setUiState({ searchTerm: e.target.value })
	}


	/*
	 *
	 *
	 */
	close(e) {
		if (e) { e.preventDefault() }
		this.props.setUiState({ isSearchBarActive: false })
	}

}

export default Search