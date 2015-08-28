Comp.Projects.Show.Tilemap.Map = class extends React.Component {

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
			project: this.props.project,
			uiState: this.props.uiState,
			setUiState: this.props.setUiState
		};
		App.Map.start();
	}

	componentWillUnmount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.Map.props = { project: undefined };
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