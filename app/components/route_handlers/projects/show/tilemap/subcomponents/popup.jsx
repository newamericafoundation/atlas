import React from 'react'
import classNames from 'classnames'

import Base from './base.jsx'


/*
 * Popup component.
 * @extends {class} Base - Base class storing shared functionality in tilemap components.
 */
class Popup extends Base {

	/*
	 *
	 *
	 */
	render() {
		var style = this.getStyle()
		var hoveredItem = this.getHoveredItem()
		if (this.props.uiState.isMapDragged || !hoveredItem) { return null }
		var cls = classNames({
			'atl__popup': true,
			'atl__popup--clear-middle': (hoveredItem.get('_itemType') === 'pin')
		})
		return (
			<div className={ cls } style={ style }>
				<div className="atl__popup__wrapper">
					<div className="atl__popup__content">
						<div id="atl__popup__content__logo" className="atl__popup__content__logo">
							{ this.renderLogo() }
						</div>
						<div className="atl__popup__content__text">
							<p>{ this.getName() }</p>
							<p>{ this.getValue() }</p>
						</div>
					</div>
				</div>
			</div>
		)
	}


	/*
	 *
	 *
	 */
	renderLogo() {
		return (
			<svg className="hex-button" viewBox="0 0 100 100">
				<g className="hex-button__border">
					<path d="M86.9,77.3L56,94.4c-3.3,1.9-8.7,1.9-12.1,0L13.1,77.3c-3.3-1.9-6-6.4-6-10.2V32.9c0-3.8,2.7-8.3,6-10.2L44,5.6c3.3-1.9,8.7-1.9,12.1,0l30.9,17.2c3.3,1.9,6,6.4,6,10.2v34.1C93,70.8,90.3,75.4,86.9,77.3"/>
				</g>
				<g className="hex-button__down">
					<path d="M61.6,47c1.7-1.7,4.5-1.7,6.2,0c1.7,1.7,1.7,4.5,0,6.2L53.5,67.6l0,0L53.1,68c-0.8,0.8-2,1.3-3.1,1.3c-1.2,0-2.3-0.5-3.1-1.3l-0.3-0.3l0,0L32.2,53.3c-1.7-1.7-1.7-4.5,0-6.2c1.7-1.7,4.5-1.7,6.2,0l7.2,7.2V35.1c0-1.2,0.5-2.3,1.3-3.1c0.8-0.8,1.9-1.3,3.1-1.3c1.2,0,2.3,0.5,3.1,1.3c0.8,0.8,1.3,1.9,1.3,3.1v19.1L61.6,47z"/>
				</g>
			</svg>
		);
	}


	/*
	 *
	 *
	 */
	getStyle() {
		var { radio } = this.props
		var hoveredItem, position
		hoveredItem = this.getHoveredItem()
		if (hoveredItem == null) { return }
		position = radio.reqres.request('item:map:position', hoveredItem)
		return {
			left: position.x,
			top: position.y,
			type: hoveredItem.get('_itemType')
		}
	}

}

export default Popup