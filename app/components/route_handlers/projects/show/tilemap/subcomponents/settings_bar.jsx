import { connect } from 'react-redux'

import React from 'react'
import classNames from 'classnames'

import Headline from './headline.jsx'
import Filter from './filter/root.jsx'

import Base from './base.jsx'

/*
 *
 *
 */
class SettingsBar extends Base {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = {}
		this.checkOverflow = this.checkOverflow.bind(this)
		// Store heights of child components in this object separate from state in order to not trigger re-renders as height values are updated.
		this.heights = {
			headline: 0,
			filter: 0,
			header: 80
		}
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
		)
	}


	componentDidMount() { this.checkOverflow() }
	componentDidUpdate() { this.checkOverflow() }


	/*
	 * If content is overflowing, set global collapsed state.
	 *
	 */
	checkOverflow() {
		var windowHeight = this.props.uiDimensions.height
		var totalHeight = this.getTotalHeight()
		var isCollapsed = totalHeight > windowHeight
		if (this.props.uiState.isCollapsedDueToOverflow !== isCollapsed) {
			this.props.setUiState({ isCollapsedDueToOverflow: isCollapsed })
		}
	}


	/*
	 * Method passed to child components so they can log their heights on the current component's state. Current component can then check whether its contents are overflowing.
	 *
	 */
	cacheHeight(elementName, height) {
		this.heights[elementName] = height
	}


	/*
	 * Get the total height of the component.
	 *
	 */
	getTotalHeight() {
		var { headline, filter, header } = this.heights
		return headline + filter + header
	}

}

export default SettingsBar