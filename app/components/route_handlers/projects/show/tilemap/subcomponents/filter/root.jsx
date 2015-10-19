import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import Help from './../../../../../../general/help.jsx';
import Icons from './../../../../../../general/icons.jsx';

import Base from './../base.jsx';

import * as formatters from './../../../../../../../utilities/formatters.js';

import FilterKey from './key.jsx';
import FilterValue from './value.jsx';

class Filter extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.maxHeight = 0;
	}


	/*
	 *
	 *
	 */
	render() {
		var MoreIcon = Icons.More;
		return (
			<div className='atl__filter' ref='root'>
				<div className="atl__filter__keys">
					<ul>
						{ this.renderKeys() }
						<li className='button' onClick={ this.toggleOptionsTab.bind(this) }>
							<MoreIcon />
						</li>
					</ul>
					<Help position='right' text='Select the variable you want to filter by.' id='filter-keys' />
				</div>
				<div className="atl__filter__values">
					<div className='atl__filter__values__heading'
						dangerouslySetInnerHTML={{ __html: this.getKeyDescriptionHtml() }}
					>
					</div>
					<ul>
						{ this.renderValues() }
					</ul>
					<Help position='right' text='Select the values you want to filter out. Corresponding map colors are indicated.' id='filter-values' />
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	renderValues() {
		var activeChild = this.props.filter.getActiveChild();
		if (!activeChild) { return; }
		var values = activeChild.children;
		return values.map((value, i) => {
			return (
				<FilterValue radio={this.props.radio} filterValue={value} key={i} />
			);
		});
	}


	/*
	 *
	 *
	 */
	getHeight() {
		var $el = $(ReactDOM.findDOMNode(this.refs.root));
		var height = $el.height();
		if (height > this.maxHeight) { this.maxHeight = height; }
		else { height = this.maxHeight }
		return height;
	}


	/*
	 *
	 *
	 */
	toggleOptionsTab() {
		this.props.setUiState({ isOptionsTabActive: !this.props.uiState.isOptionsTabActive });
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		this.props.cacheHeight(this.getHeight());
	}


	/*
	 * Render only three around the current active key.
	 *
	 */
	renderKeys() {
		var keys = this.props.filter.children,
			activeKey = this.props.filter.getActiveChild(),
			index = keys.indexOf(activeKey),
			neighborHood = this.props.filter.getActiveChildNeighborhood(0);
		return neighborHood.map((key, i) => {
			return (
				<FilterKey radio={this.props.radio} filterKey={key} key={i} />
			);
		});
	}


	/*
	 *
	 *
	 */
	getKeyDescriptionHtml() {
		var keys = this.props.filter.children,
			activeKey = this.props.filter.getActiveChild();
		
		if (activeKey) {
			let longDescription = activeKey.get('variable').get('long_description');
			return formatters.markdown(longDescription);
		}
	}

}


export default Filter;