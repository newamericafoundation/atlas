import React from 'react'
import classNames from 'classnames'

import Map from './subcomponents/map/root.jsx'
import TopBar from './subcomponents/top_bar.jsx'
import SettingsBar from './subcomponents/settings_bar.jsx'
import Popup from './subcomponents/popup.jsx'
import InfoBox from './subcomponents/info_box.jsx'
import List from './subcomponents/list.jsx'
import Search from './subcomponents/search.jsx'
import OptionsTab from './subcomponents/options_tab/root.jsx'

export default class Tilemap extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			// Determines whether the custom d3 Mapper module should update the map when the wrapper component updates.
			ignoreMapItemsOnUpdate: false
		}
	}

	render() {
		if (!this.isHealthy()) {
			return <div className='bg-c-off-white'><p className='title'>Project data is invalid.</p></div>
		}
		return (
			<div className='atl__main fill-parent'>
				{ this.renderItems() }
				<TopBar {...this.props} />
				<SettingsBar {...this.props} uiDimensions={this.props.app.ui.dimensions} />
				<Popup {...this.props} />
				{ this.props.uiState.isSearchBarActive ? <Search {...this.props} /> : null }
				<InfoBox {...this.props} activeItem={ this.getActiveItem() } />
				{ this.renderOptionsTab() }
			</div>
		)
	}

	componentWillMount() {
		var { radio } = this.props
		radio.commands.setHandler('update:tilemap', (args = {}) => {
			this.setState({ ignoreMapItemsOnUpdate: args.ignoreMapItems })
		})
	}

	componentWillUnmount() {
		var { radio } = this.props
		radio.commands.removeHandler('update:tilemap')
	}

	isHealthy() {
		var { project } = this.props
		if (!project) { return false }
		if (!project.get('data')) { return false }
		if (!project.get('data').items) { return false }
		return true
	}

	renderOptionsTab() {
		if (!this.props.uiState.isOptionsTabActive) { return }
		var { project } = this.props
		if (!project) { return }
		var { filter } = project.get('data')
		return (<OptionsTab {...this.props} filter={filter} />);
	}

	renderItems() {
		if (this.props.uiState.itemsDisplayMode === 'map') {
			return <Map {...this.props} ignoreMapItemsOnUpdate={this.state.ignoreMapItemsOnUpdate} />
		} else {
			return <List {...this.props} />
		}
	}

	getActiveItem() {
		return this.props.project.get('data').items.active
	}
}
