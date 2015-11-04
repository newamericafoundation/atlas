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

		var { radio, filter, project } = this.props;

		var keys = filter.children;

		var groups = filter.group(project.get('data').variable_groups);

		console.log(groups);

		var shouldDisplayHeader = (groups.length > 1);
		
		return groups.map((group, i) => {

			return (
				<FilterKeyGroup
					radio={radio}
					group={group}
					shouldDisplayHeader={shouldDisplayHeader}
					key={i}
				/>
			);

		});
	}

}

export default OptionsTab;