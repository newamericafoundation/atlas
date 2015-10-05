import React from 'react';
import classNames from 'classnames';
import { No } from './../../../../../general/icons.jsx';

import _ from 'underscore';

import Base from './base.jsx';

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

		var areVariablesGrouped = (groups.length > 1);
		
		return groups.map((group) => {

			var groupName, groupDescription,
				varGroup = group.variable_group;

			if (_.isObject(varGroup)) {
				groupName = varGroup.get('display_title') || varGroup.get('id');
				groupDescription = varGroup.get('long_description');
			} else {
				groupName = varGroup || 'Other variables';
				groupDescription = '';
			}

			return (
				<li>
					{ areVariablesGrouped ? (<p className='title'>{ groupName }</p>) : null }
					{ areVariablesGrouped ? (<p>{ groupDescription }</p>) : null }
					<ul>
						{ this.renderKeys(group.filterKeys) }
					</ul>
				</li>
			);

		});
	}


	/*
	 * Render only three around the current active key.
	 *
	 */
	renderKeys(keys) {
		return keys.map((key, i) => {
			return (
				<FilterKey radio={this.props.radio} filterKey={key} key={i} />
			);
		});
	}

}

class FilterKey extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		var cls = classNames({
			'button': 'true',
			'button--active': this.props.filterKey.isActive()
		});
		return (
			<li className={ cls } onClick={ this.toggle.bind(this) }>
				<p>
					{ this.getContent() }
				</p>
			</li>
		);
	}


	/*
	 *
	 *
	 */
	getContent() {
		return this.props.filterKey.get('variable').get('display_title');
	}


	/*
	 *
	 *
	 */
	toggle() {
		var { radio } = this.props;
		this.props.filterKey.clickToggle();
		radio.commands.execute('update:tilemap');
	}

}

export default OptionsTab;