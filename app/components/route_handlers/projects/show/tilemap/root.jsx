Comp.Projects.Show.Tilemap = class extends React.Component {
	
	render() {
		return (
			<div className='atl__main fill-parent'>
				{ this.renderItems() }
				<Comp.Projects.Show.Tilemap.Map {...this.props} />
				<Comp.Projects.Show.Tilemap.TopBar {...this.props} />			
				<Comp.Projects.Show.Tilemap.SettingsBar {...this.props} />
				<Comp.Projects.Show.Tilemap.Popup {...this.props} />
				<Comp.Projects.Show.Tilemap.InfoBox {...this.props} activeItem={ this.getActiveItem() } />
				{ this.renderBaseLayer() }
			</div>
		);
		
	}

	renderItems() {
		if (this.props.uiState.itemsDisplayMode === 'map') {
			return (<Comp.Projects.Show.Tilemap.Map {...this.props} />);
		} else {
			return (<Comp.Projects.Show.Tilemap.List {...this.props} />);
		}
	}

	renderBaseLayer() {
		return;
		return (
			<div className="atl__base-layer" />
		);
	}

	getActiveItem() {
		return this.props.project.get('data').items.active;
	}

	componentWillMount() {
		var App = this.props.App;
		if (App == null) { return; }
		App.commands.setHandler('update:tilemap', () => {
			this.forceUpdate();
		});
	}

}