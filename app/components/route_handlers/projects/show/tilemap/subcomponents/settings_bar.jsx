import React from 'react';
import classNames from 'classnames';

import Headline from './headline.jsx';
import Filter from './filter/root.jsx';

import Base from './base.jsx';

class SettingsBar extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = this.state || {};
		// Store heights of child components in this object separate from state in order to not trigger re-renders as height values are updated.
		this.heights = {
			window: 0,
			headline: 0,
			filter: 0,
			header: 80
		};
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__settings-bar'>
				<Headline {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'headline') } />
				<Filter {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'filter') } filter={ this.getFilter() } />
			</div>
		);
		
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		// Make sure overflow is checked even after render lags.
		setTimeout(this.checkOverflow.bind(this), 300);
		setTimeout(this.checkOverflow.bind(this), 600);
		setTimeout(this.checkOverflow.bind(this), 900);
		// Namespace resize event for convenient removal.
		$(window).on('resize.settings-bar-overflow', () => {
			this.checkOverflow();
		});
	}


	/*
	 *
	 *
	 */
	componentWillUnmount() {
		// Remove namespaced event.
		$(window).off('resize.settings-bar-overflow');
	}


	/*
	 * If content is overflowing, set global collapsed state.
	 *
	 */
	checkOverflow() {
		var totalHeight, isCollapsed;
		this.heights.window = $(window).height();
		totalHeight = this.getTotalHeight();
		isCollapsed = totalHeight > this.heights.window;
		if (this.props.uiState.isCollapsedDueToOverflow !== isCollapsed) {
			this.props.setUiState({ isCollapsedDueToOverflow: isCollapsed });
		}
	}


	/*
	 * Method passed to child components so they can log their heights on the current component's state. Current component can then check whether its contents are overflowing.
	 *
	 */
	cacheHeight(elementName, height) {
		this.heights[elementName] = height;
	}


	/*
	 * Get the total height of the component.
	 *
	 */
	getTotalHeight() {
		return this.heights.headline + this.heights.filter + this.heights.header;
	}

}

export default SettingsBar;