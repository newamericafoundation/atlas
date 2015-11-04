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
	componentWillMount() {
		this.computeVariableGroups();
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
	 * Compute variable groups and set on state.
	 * TODO: extract to model code.
	 */
	computeVariableGroups() {
		var { filter, project } = this.props;
		var keys = filter.children;
		var groups = filter.group(project.get('data').variable_groups);
		var shouldDisplayHeader = (groups.length > 1);

		this.setState({
			groups: groups,
			shouldDisplayHeader: shouldDisplayHeader
		});
	}


	/*
	 * 
	 *
	 */
	renderKeyGroups() {

		var { radio } = this.props;
		
		return this.state.groups.map((group, i) => {

			return (
				<FilterKeyGroup
					radio={radio}
					group={group}
					shouldDisplayHeader={this.state.shouldDisplayHeader}
					key={i}
				/>
			);

		});
	}

}

export default OptionsTab;