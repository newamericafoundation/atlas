import React from 'react'
import classNames from 'classnames'

import Control from './subcomponents/control/root.jsx'
import Mapper from './subcomponents/mapper/mapper.js'


/*
 * Container for the Leaflet map object.
 *
 */
class Map extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.state = {
			// Map instance (Leaflet)
			map: undefined
		}
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="fill-parent" id="atl__map">
				<Control map={this.state.map} />
			</div>
		)
	}


	/*
	 *
	 *
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return !nextProps.ignoreMapItemsOnUpdate
	}


	/*
	 * Add props and React parent component methods to d3 Mapper module.
	 *
	 */
	componentDidMount() {
		Mapper.props = {
			radio: this.props.radio,
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState,
			setMap: this.setMap.bind(this)
		}
		Mapper.start()
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		if (!this.props.uiState.isMapDragged && Mapper.overlayView) { 
			Mapper.overlayView.update()
		}
	}


	/*
	 * Remove passed props from mapper and stop.
	 *
	 */
	componentWillUnmount() {
		delete Mapper.props
		Mapper.stop()
	}


	/*
	 * Set Mapbox map instance. On the component state.
	 *
	 */
	setMap(map) {
		this.setState({ map: map })
	}

}

export default Map