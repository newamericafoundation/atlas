import React from 'react';
import classNames from 'classnames';

import Headline from './headline.jsx';
import DisplayToggle from './display_toggle.jsx';
import Search from './search.jsx';
import Filter from './filter.jsx';

class SettingsBar extends React.Component {

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
				<DisplayToggle {...this.props} />
				<Search {...this.props} />
				<Filter {...this.props} cacheHeight={ this.cacheHeight.bind(this, 'filter') } filter={ this.getFilter() } />
			</div>
		);
		
	}

	componentDidMount() {
		this.checkOverflow();
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
		totalHeight = this.heights.headline + this.heights.filter + this.heights.header;
		isCollapsed = totalHeight > this.heights.window;
		if (this.props.uiState.isCollapsed !== isCollapsed) {
			this.props.setUiState({ isCollapsed: isCollapsed });
		}
	}

	// Method passed to child components so they can log their heights on the current
	//   component's state. Current component can then check whether its contents are overflowing.
	cacheHeight(elementName, height) {
		this.heights[elementName] = height;
	}

	getFilter() {
		return this.props.project.get('data').filter;
	}

}

export default SettingsBar;