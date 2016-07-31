import React from 'react'
import classNames from 'classnames'

import { Info, Plus, Minus } from './../../../../../../../../general/icons.jsx'


/*
 * Map control.
 *
 */
class Control extends React.Component {

	/*
	 *
	 *
	 */
	constructor(props) {
		super(props)
		this.showAttribution = this.showAttribution.bind(this)
		this.zoomIn = this.zoom.bind(this, +1)
		this.zoomOut = this.zoom.bind(this, -1)
	}


	/*
	 *
	 *
	 */
	render() {
		return (
			<div className='atl__map-control'>
				<div onClick={this.showAttribution} className='atl__map-control__button'>
					<Info />
				</div> 
				<div onClick={ this.zoomIn } className='atl__map-control__button'>
					<Plus />
				</div>
				<div onClick={ this.zoomOut } className='atl__map-control__button'>
					<Minus />
				</div>
				<div className='atl__help atl__help--left'>
					View <b>copyright</b> information about the map and <b>zoom</b> in and out.
				</div>
			</div>
		);
	}


	/*
	 *
	 *
	 */
	zoom(zoomChange) {
		var { map } = this.props
		if (!map) { return }
		map.changeZoom(zoomChange)
	}


	/*
	 *
	 *
	 */
	showAttribution() {
		$('.leaflet-control-attribution').toggle()
	}

}

export default Control