import React from 'react';
import classNames from 'classnames';
import Icons from './../../../../../general/icons.jsx';

var buttons = [
	{ name: 'filter', iconName: 'Filter' }, 
	{ name: 'search', iconName: 'Search' }
];

class DisplayToggle extends React.Component {

	render() {
		return (

			<div className="atl__display-toggle binary-toggle">
				{ this.renderHalves() }
			</div>
		);
	}

	renderHalves() {
		return buttons.map((half, i) => {
			var IconComp = Icons[half.iconName],
				cls = classNames({
					'binary-toggle__link': true,
					'binary-toggle__link--active': (this.props.uiState.display === half.name)
				});
			return (
				<div className="binary-toggle__half" key={i}>
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
		if (this.props.uiState.display === name) { return; }
		this.props.setUiState({ display: name });
	}

}

export default DisplayToggle;