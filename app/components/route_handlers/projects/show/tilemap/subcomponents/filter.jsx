import React from 'react';
import classNames from 'classnames';
import Help from './../../../../../general/help.jsx';
import Icons from './../../../../../general/icons.jsx';

import * as colors from './../../../../../utilities/colors.js';

class Filter extends React.Component {

	constructor(props) {
		super(props);
		this.maxHeight = 0;
	}

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
					<ul>
						{ this.renderValues() }
					</ul>
					<Help position='right' text='Select the values you want to filter out. Corresponding map colors are indicated.' id='filter-values' />
				</div>
			</div>
		);
	}

	getHeight() {
		var $el = $(React.findDOMNode(this.refs.root));
		var height = $el.height();
		if (height > this.maxHeight) { this.maxHeight = height; }
		else { height = this.maxHeight }
		return height;
	}

	toggleOptionsTab() {
		this.props.setUiState({ isOptionsTabActive: !this.props.uiState.isOptionsTabActive });
	}

	componentDidUpdate() {
		this.props.cacheHeight(this.getHeight());
	}

	// Render only three around the current active key.
	renderKeys() {
		var keys = this.props.filter.children,
			activeKey = this.props.filter.getActiveChild(),
			index = keys.indexOf(activeKey),
			neighborHood = this.props.filter.getActiveChildNeighborhood(1);
		return neighborHood.map((key, i) => {
			return (
				<FilterKey App={this.props.App} filterKey={key} key={i} />
			);
		});
	}

	renderValues() {
		var activeChild = this.props.filter.getActiveChild();
		if (!activeChild) { return; }
		var values = activeChild.children;
		return values.map((value, i) => {
			return (
				<FilterValue App={this.props.App} filterValue={value} key={i} />
			);
		});
	}

}


class FilterKey extends React.Component {

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

	getContent() {
		return this.props.filterKey.get('variable').get('display_title');
	}

	toggle() {
		var App = this.props.App;
		this.props.filterKey.clickToggle();
		if (App == null) { return; }
		App.commands.execute('update:tilemap');
	}

}


class FilterValue extends React.Component {

	render() {
		var IconComp = Icons.Hex;
		return (
			<li className={ 'toggle-button ' + this.getModifierClass() } onClick={ this.toggle.bind(this) } onMouseEnter={ this.setHovered.bind(this) } onMouseLeave={ this.clearHovered.bind(this) } >
				<IconComp className="toggle-button__icon" fillColor={this.getColor()} />
				<div className="toggle-button__text">
				   	<p>{ this.props.filterValue.get('value') }</p>
				</div>
			</li>
		);
	}

	getModifierClass() {
		var siblingsIncludingSelf = this.props.filterValue.parent.children
		if (!this.props.filterValue.isActive()) { return 'toggle-button--inactive'; }
		return '';
	}

	getColor() {
		if (!this.props.filterValue.isActive()) { return; }
		var i = this.props.filterValue.getFriendlySiblingIndex(15);
		return colors.toRgba(i - 1);
	}

	setHovered() {
		var App, modelIndex, color;
		App = this.props.App;
		modelIndex = this.getFilterValueIndex();
		this.props.filterValue.parent.parent.state.valueHoverIndex = modelIndex;
		App.commands.execute('update:tilemap');
		color = this.getColor();
		App.commands.execute('set:header:strip:color', { color: color });
	}

	clearHovered() {
		var App;
		App = this.props.App;
		this.props.filterValue.parent.parent.state.valueHoverIndex = -1;
		App.commands.execute('update:tilemap');
		App.commands.execute('set:header:strip:color', 'none');
	}

	getFilterValueIndex() {
		return this.props.filterValue.parent.children.indexOf(this.props.filterValue);
	}

	toggle() {
		var App;
		this.props.filterValue.toggle();
		App = this.props.App;
		if (App == null) { return; }
		App.commands.execute('update:tilemap');
	}

}


export default Filter;