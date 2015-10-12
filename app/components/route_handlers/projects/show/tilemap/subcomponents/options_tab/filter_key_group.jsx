import React from 'react';
import classNames from 'classnames';
import marked from 'marked';

import { Plus, Minus } from './../../../../../../general/icons.jsx';

import FilterKey from './filter_key.jsx';

class FilterKeyGroup extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			isExpanded: false
		};
	}


	/*
	 *
	 *
	 */
	render() {

		return (
			<li>
				{ this.renderHeading() }
				<ul>
					{ this.renderKeys() }
				</ul>
			</li>
		);

	}


	renderHeading() {
		if (!this.props.shouldDisplayHeader) { return; }
		var info = this.getGroupInfo();
		return (
			<div className='atl__filter__var-group'>
				{ this.renderToggleIcon(info.description.length > 0) }
				<h1 className='title'>
					{ info.name }
				</h1>
				{ this.state.isExpanded 
					? 
						<div 
							className='atl__filter__var-group__description'
							dangerouslySetInnerHTML={
								{
									__html: marked(info.description, { sanitize: true })
								}
							} 
						/> 
					: 
						null 
				}
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderToggleIcon(hasDescription) {
		if (!hasDescription) { return; }
		var ToggleIcon = this.state.isExpanded ? Minus : Plus;
		return (
			<div 
				className='atl__filter__var-group__toggle-icon'
				onClick={this.toggleExpandedState.bind(this)}
			>
				<ToggleIcon />
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderKeys() {
		var keys = this.props.group.filterKeys;
		return keys.map((key, i) => {
			return (
				<FilterKey radio={this.props.radio} filterKey={key} key={i} />
			);
		});
	}


	/*
	 *
	 *
	 */
	getGroupInfo() {

		var varGroup = this.props.group.variable_group,
			info = {};

		if (_.isObject(varGroup)) {
			info.name = varGroup.get('display_title') || varGroup.get('id');
			info.description = varGroup.get('long_description');
		} else {
			info.name = varGroup || 'Other variables';
			info.description = '';
		}

		return info;

	}


	/*
	 * Toggle expanded state only if the description is not empty.
	 *
	 */
	toggleExpandedState() {
		this.setState({ isExpanded: !this.state.isExpanded });
	}

}

export default FilterKeyGroup;