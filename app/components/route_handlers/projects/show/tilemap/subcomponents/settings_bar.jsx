import { connect } from 'react-redux'
import React from 'react'
import classNames from 'classnames'

import Headline from './headline.jsx'
import Filter from './filter/root.jsx'
import Base from './base.jsx'


class SettingsBar extends Base {
	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<div className='atl__settings-bar'>
				<Headline {...this.props}/>
				<Filter {...this.props} filter={ this.getFilter() } />
			</div>
		)
	}
}

export default SettingsBar
