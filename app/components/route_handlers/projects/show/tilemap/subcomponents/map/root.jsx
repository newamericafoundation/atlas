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

	componentDidMount() {
		var Map = window.Map;
		Map.props = {
			App: this.props.App,
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
		if (Map.overlayView) { Map.overlayView.update(); }
	}

}

export default Map;