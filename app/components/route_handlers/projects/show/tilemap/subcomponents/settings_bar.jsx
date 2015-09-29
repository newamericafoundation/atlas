import React from 'react';
import classNames from 'classnames';

import Headline from './headline.jsx';
import DisplayToggle from './display_toggle.jsx';
import Filter from './filter.jsx';

import OverviewBase from './overview_base.jsx';

class SettingsBar extends OverviewBase {

	constructor(props) {
		super(props);
		this.state = {
			dummy: 'dummy'
		};
		this.heights = {
			window: 0,
			headline: 0,
			filter: 0,
			header: 80
		};
	}

	render() {
		return (
			<div className='atl__settings-bar' ref='root'>
				<Headline {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'headline') } />
				{
				// <div className='atl__settings-bar__item-summary'>
				// 	<p>{ this.getName() }</p>
				// 	<p>{ this.getValue() }</p>
				// </div>
				}
				<Filter {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'filter') } filter={ this.getFilter() } />
			</div>
		);
		
	}

	componentDidMount() {
		// make sure overflow is checked even after render lags
		setTimeout(this.checkOverflow.bind(this), 300);
		setTimeout(this.checkOverflow.bind(this), 600);
		setTimeout(this.checkOverflow.bind(this), 900);
		// namespace resize event for convenient removal
		$(window).on('resize.settings-bar-overflow', () => {
			this.checkOverflow();
		});
	}

	componentWillUnmount() {
		// remove namespaced event
		$(window).off('resize.settings-bar-overflow');
	}

	// If content is overflowing, set global collapsed state.
	checkOverflow() {
		// console.log('checking overflow');
		var totalHeight, isCollapsed,
			App = this.props.App;
		if (App == null) { return; }
		this.heights.window = $(window).height();
		totalHeight = this.getTotalHeight();
		isCollapsed = totalHeight > this.heights.window;
		if (this.props.uiState.isCollapsedDueToOverflow !== isCollapsed) {
			this.props.setUiState({ isCollapsedDueToOverflow: isCollapsed });
		}
	}

	// Method passed to child components so they can log their heights on the current
	//   component's state. Current component can then check whether its contents are overflowing.
	cacheHeight(elementName, height) {
		this.heights[elementName] = height;
	}

	getTotalHeight() {
		return this.heights.headline + this.heights.filter + this.heights.header;
	}

}

export default SettingsBar;