import React from 'react';
import Icons from './../../../../../general/icons.jsx';

class DisplayToggle extends React.Component {

	render() {
		return (

			<div className="atl__display-toggle atl__binary-toggle">
				{ this.renderHalves() }
			</div>
		);
	}

	renderHalves() {
		return [ { name: 'filter', iconName: 'Filter' }, { name: 'search', iconName: 'Search' } ].map((half) => {
			var IconComp = Icons[half.iconName],
				cls = classNames({
					'atl__binary-toggle__link': true,
					'atl__binary-toggle__link--active': (this.props.uiState.display === half.name)
				});
			return (
				<div className="atl__binary-toggle__half">
					<a 
						href="#"
						onClick={ this.setUiDisplay.bind(this, half.name) } 
						className={ cls }
					>
						<IconComp />
					</a>
				</div>
			);
		});
	}

	// 
	setUiDisplay(name) {
		var App;
		if (this.props.uiState.display === name) { return; }
		App = this.props.App;
		if (App != null) { App.vent.trigger('display:mode:change'); }
		this.props.setUiState({ display: name });
	}

}

export default DisplayToggle;