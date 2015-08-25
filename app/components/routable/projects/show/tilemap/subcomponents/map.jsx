Comp.Projects.Show.Tilemap.Map = class extends React.Component {

	constructor(props) {
		super(props);
	}

	get displayName() { return 'Comp.Projects.Show.Tilemap.Map'; }

	render() {
		return (
			<div className="fill-parent" id="atl__map"></div>
		);
	}

	componentDidMount() {
		App = this.props.App;
		if (App == null) { return; }
		App.Map.props = { 
			project: this.props.project,
			uiState: this.props.uiState
		};
		App.Map.start();
	}

	componentWillUnmount() {
		App = this.props.App;
		if (App == null) { return; }
		App.Map.props = { project: undefined };
		App.Map.stop();
	}

}