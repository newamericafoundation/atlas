import React from 'react';
import classNames from 'classnames';
import * as colors from './../../../../../utilities/colors.js';
import * as svgPaths from './../../../../../utilities/svg_paths.js';

class Map extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="fill-parent" id="atl__map"></div>
		);
	}

	componentDidMount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.Map.props = {
			App: this.props.App,
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState
		};
		App.Map.colors = colors;
		App.Map.svgPaths = svgPaths;
		App.Map.start();
	}

	componentWillUnmount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.Map.props = { project: undefined };
		App.Map.stop();
	}

	componentDidUpdate() {
		// console.log('updating');
		var App = this.props.App;
		if (App == null) { return; }
		if (App.Map.overlayView) {
			App.Map.overlayView.update();
		} else {
		}
	}

}

export default Map;