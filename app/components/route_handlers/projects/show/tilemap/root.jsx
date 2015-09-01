Comp.Projects.Show.Tilemap = class extends React.Component {
	
	render() {
		var T = Comp.Projects.Show.Tilemap;
		return (
			<div className='atl__main fill-parent'>
				{ this.renderItems() }
				<T.Map {...this.props} />
				<T.TopBar {...this.props} />			
				<T.SettingsBar {...this.props} />
				<T.Popup {...this.props} />
				<T.InfoBox {...this.props} activeItem={ this.getActiveItem() } />
				{ this.renderBaseLayer() }
			</div>
		);
		
	}

	renderItems() {
		var T = Comp.Projects.Show.Tilemap;
		if (this.props.uiState.itemsDisplayMode === 'map') {
			return (<T.Map {...this.props} />);
		} else {
			return (<T.List {...this.props} />);
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