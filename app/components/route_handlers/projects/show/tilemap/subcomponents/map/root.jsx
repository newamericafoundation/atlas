import React from 'react';
import classNames from 'classnames';
import * as colors from './../../../../../../utilities/colors.js';
import * as svgPaths from './../../../../../../utilities/svg_paths.js';

import Control from './subcomponents/control/root.jsx';

import Mapper from './subcomponents/mapper/mapper.js';

class Map extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props);
		this.state = {
			map: undefined
		};
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
		);
	}


	/*
	 *
	 *
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return !nextProps.ignoreMapItemsOnUpdate;
	}


	/*
	 *
	 *
	 */
	componentDidMount() {
		Mapper.props = {
			radio: this.props.radio,
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState,
			setMap: this.setMap.bind(this)
		};
		Mapper.colors = colors;
		Mapper.svgPaths = svgPaths;
		Mapper.start();
	}


	/*
	 * Set Mapbox map instance. On the component state.
	 *
	 */
	setMap(map) {
		this.setState({ map: map });
	}


	/*
	 *
	 *
	 */
	componentWillUnmount() {
		Mapper.props = {};
		Mapper.stop();
	}


	/*
	 *
	 *
	 */
	componentDidUpdate() {
		if (!this.props.uiState.isMapDragged && Mapper.overlayView) { 
			Mapper.overlayView.update(); 
		}
	}

}

export default Map;