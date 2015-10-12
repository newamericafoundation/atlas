import React from 'react';
import classNames from 'classnames';
import { No } from './../../../../../../general/icons.jsx';

import _ from 'underscore';

import Base from './../base.jsx';

import FilterKeyGroup from './filter_key_group.jsx';

class OptionsTab extends Base {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__options-tab'>
				<a href='#' className='atl__options-tab__close' onClick={ this.close.bind(this) }>
					<No />
				</a>
				<div className='atl__options-tab__content'>
					<ul>
						{ this.renderKeyGroups() }
					</ul>
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	close(e) {
		e.preventDefault();
		this.props.setUiState({ isOptionsTabActive: false });
	}


	/*
	 * 
	 *
	 */
	renderKeyGroups() {

		var keys = this.props.filter.children;

		var groups = this.props.filter.group(this.props.project.get('data').variable_groups);

		var shouldDisplayHeader = (groups.length > 1);
		
		return groups.map((group, i) => {

			return (
				<FilterKeyGroup
					radio={this.props.radio}
					group={group}
					shouldDisplayHeader={shouldDisplayHeader}
					key={i}
				/>
			);

		});
	}

}

export default OptionsTab;