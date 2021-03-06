import React from 'react';
import classNames from 'classnames';

import Slider from './../../../../../general/slider.jsx';
import { More } from './../../../../../general/icons.jsx';
import Base from './base.jsx';


/*
 *
 *
 */
class TopBar extends Base {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="atl__top-bar">
				<div className={ this.getContentClassName() }>
					{ false ? <TopBarIcons {...this.props} /> : null }
					{ this.renderTimeline() }
					<div className="atl__top-bar__title">
						<div>
							<h1>{ this.props.project.get('title') }</h1>
						</div>
					</div>
					<div className="atl__top-bar__summary">
						<div className="atl__top-bar__summary__item">
							<div className='button button--active'>
								<p>{ this.getKey() }</p>
							</div>
							<div className='button' onClick={ this.toggleOptionsTab.bind(this) }>
								<More />
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	toggleOptionsTab() {
		this.props.setUiState({ isOptionsTabActive: !this.props.uiState.isOptionsTabActive });
	}


	/*
	 *
	 *
	 */
	getContentClassName() {
		return classNames({
			'atl__top-bar__content': true,
		}, this.getBackgroundColorClass());
	}


	/*
	 *
	 *
	 */
	renderTimeline() {
		return;
		return (
			<div className="atl__top-bar__timeline">
				<Slider {...this.props} values={[ '2003', '2004', '2005', '2006' ]} />
			</div>
		);
	}


	/*
	 *
	 *
	 */
	getBackgroundColorClass() {
		var hoveredItem, indeces, cls;
		indeces = this.props.project.getFriendlyIndeces();
		if (indeces == null || indeces.length === 0) { return 'bg-c-grey--light'; }
		cls = `bg-c-${indeces[0]}`;
		return cls;
	}

}



/*
 * Control icons for the top bar component.
 * NOT USED CURRENTLY
 */
class TopBarIcons extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		return (
			<div className="atl__top-bar__icons">
				<ul className='icons'>
					{ this.renderIcons() }
				</ul>
			</div>
		);
	}


	/*
	 *
	 *
	 */
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


	/*
	 *
	 *
	 */
	renderIcons() {
		return this.getIconData().map((icon, i) => {
			return (
				<TopBarIcon {...this.props} icon={icon} key={i} />
			);
		});
	}

}



/*
 * Single icon.
 *
 */
class TopBarIcon extends React.Component {

	/*
	 *
	 *
	 */
	render() {
		var Icon = Icons[this.props.icon.reactIconName],
			cls = classNames({
				'icons__icon': true,
				'icons__icon--active': this.isActive()
			});
		return (
			<li className={ cls } onClick={this.changeGlobalItemsDisplayMode.bind(this)} >
				<Icon />
			</li>
		);
	}


	/*
	 *
	 *
	 */
	changeGlobalItemsDisplayMode() {
		this.props.setUiState({
			itemsDisplayMode: this.props.icon.id
		});
	}


	/*
	 *
	 *
	 */
	isActive() {
		return (this.props.uiState.itemsDisplayMode === this.props.icon.id);
	}

}


export default TopBar;