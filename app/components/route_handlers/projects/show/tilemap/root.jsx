import React from 'react';
import Map from './subcomponents/map.jsx';
import TopBar from './subcomponents/top_bar.jsx';
import SettingsBar from './subcomponents/settings_bar.jsx';
import Popup from './subcomponents/popup.jsx';
import InfoBox from './subcomponents/info_box.jsx';
import List from './subcomponents/list.jsx';

class Tilemap extends React.Component {
	
	render() {
		return (
			<div className='atl__main fill-parent'>
				{ this.renderItems() }
				<TopBar {...this.props} />			
				<SettingsBar {...this.props} />
				<Popup {...this.props} />
				<InfoBox {...this.props} activeItem={ this.getActiveItem() } />
				{ this.renderBaseLayer() }
			</div>
		);
		
	}

	renderItems() {
		if (this.props.uiState.itemsDisplayMode === 'map') {
			return (<Map {...this.props} />);
		} else {
			return (<List {...this.props} />);
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

export default Tilemap;