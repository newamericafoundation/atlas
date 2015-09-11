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
		var App = this.props.App;
		if (App == null) { return; }
		App.Map.props = {
			App: this.props.App,
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState,
			setMap: this.setMap.bind(this)
		};
		App.Map.colors = colors;
		App.Map.svgPaths = svgPaths;
		App.Map.start();
	}

	// Set Mapbox map instance. On the component state.
	setMap(map) {
		this.setState({ map: map });
	}

	componentWillUnmount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.Map.props = {};
		App.Map.stop();
	}

	componentDidUpdate() {
		var App = this.props.App;
		if (App == null) { return; }
		if (App.Map.overlayView) {
			App.Map.overlayView.update();
		} else {
		}
	}

}

export default Map;