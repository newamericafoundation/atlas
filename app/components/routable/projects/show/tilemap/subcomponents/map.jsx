Comp.Projects.Show.Tilemap.Map = class extends React.Component {

	get displayName() { return 'Comp.Projects.Show.Tilemap.Map'; }

	render() {
		return (
			<div className="fill-parent" id="atl__map"></div>
		);
	}

	componentDidMount() {
		App = this.props.App;
		if (App == null) { return; }
		App.Map.Controller.show();
	}

	componentWillUnmount() {
		App = this.props.App;
		if (App == null) { return; }
		App.Map.Controller.destroy();
	}

}