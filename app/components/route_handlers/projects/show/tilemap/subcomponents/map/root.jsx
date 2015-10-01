import React from 'react';
import classNames from 'classnames';
import * as colors from './../../../../../../utilities/colors.js';
import * as svgPaths from './../../../../../../utilities/svg_paths.js';

import Control from './subcomponents/control.jsx';

class Map extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			map: undefined
		};
	}

	render() {
		return (
			<div className="fill-parent" id="atl__map">
				<Control map={this.state.map} />
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !nextProps.ignoreMapItemsOnUpdate;
	}

	componentDidMount() {
		var Map = window.Map;
		Map.props = {
			radio: this.props.radio,
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState,
			setMap: this.setMap.bind(this)
		};
		Map.colors = colors;
		Map.svgPaths = svgPaths;
		Map.start();
	}

	// Set Mapbox map instance. On the component state.
	setMap(map) {
		this.setState({ map: map });
	}

	componentWillUnmount() {
		var Map = window.Map;
		Map.props = {};
		Map.stop();
	}

	componentDidUpdate() {
		var Map = window.Map;
		if (!this.props.uiState.isMapDragged && Map.overlayView) { 
			Map.overlayView.update(); 
		}
	}

}

export default Map;