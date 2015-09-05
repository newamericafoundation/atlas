import React from 'react';
import Slider from './../../../../../general/slider.jsx';
import Icons from './../../../../../general/icons.jsx';

class TopBar extends React.Component {

	render() {
		return (
			<div className="atl__top-bar">
				<div className="atl__top-bar__content">
					<TopBarIcons {...this.props} />
					{ this.renderTimeline() }
					<div className="atl__top-bar__summary">
						<div>{ this.getName() }</div>
					</div>
				</div>
			</div>
		);
	}

	renderTimeline() {
		return;
		return (
			<div className="atl__top-bar__timeline">
				<Slider {...this.props} values={[ '2003', '2004', '2005', '2006' ]} />
			</div>
		);
	}

	getName() {
		var hoveredItem = this.getHoveredItem();
		if (hoveredItem == null) { return; }
		return hoveredItem.get('name');
	}

	getHoveredItem() {
		return this.props.project.get('data').items.hovered;
	}

	getBackgroundColorClass() {
		var App, filter, hoveredItem, indeces, cls;
		App = this.props.App;
		filter = this.props.project.get('data').filter;
		hoveredItem = this.getHoveredItem();
		indeces = filter.getFriendlyIndeces(hoveredItem, 15);
		cls = `bg-c-${indeces[0]}`;
		return cls;
	}

}


class TopBarIcons extends React.Component {

	render() {
		return (
			<div className="atl__top-bar__icons">
				<ul className='icons'>
					{ this.renderIcons() }
				</ul>
			</div>
		);
	}

	getIconData() {
		return [
			{
				id: 'map',
				reactIconName: 'UsMap'
			},
			{
				id: 'info',
				reactIconName: 'Dictionary'
			}
		];
	}

	renderIcons() {
		return this.getIconData().map((icon) => {
			return (
				<TopBarIcon {...this.props} icon={icon} />
			);
		});
	}

}

class TopBarIcon extends React.Component {

	render() {
		var Icon = Icons[this.props.icon.reactIconName];
		return (
			<li className={ 'icons__icon ' + this.getModifierClass() } onClick={this.changeGlobalItemsDisplayMode.bind(this)} >
				<Icon />
			</li>
		);
	}

	changeGlobalItemsDisplayMode() {
		this.props.setUiState({
			itemsDisplayMode: this.props.icon.id
		});
	}

	getModifierClass() {
		if (this.isActive()) { return 'icons__icon--active'; }
		return '';
	}

	isActive() {
		return (this.props.uiState.itemsDisplayMode === this.props.icon.id);
	}

}


export default TopBar;