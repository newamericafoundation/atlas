// This is a custom view constructor that uses d3 and Mapbox to render graphics.

import _ from 'underscore'
import Backbone from 'backbone'

import controlHelpers from './control_helpers.js'


/*
 *
 *
 */
class RootView {

	/*
	 *
	 *
	 */
	constructor(options) {
		this.el = options.el
		this.elId = this.el.substr(1)
		this.$el = $(this.el)
		_.extend(this, Backbone.Events)
		return this
	}
			

	/*
	 * Get optimal start zoom level corresponding to the width of the container.
	 *
	 */
	getZoomLevel() {
		var width = this.$el.width()
		if (width > 1350) { return 5 }
		if (width > 700) { return 4 }
		return 3
	}


	/*
	 * Set up map.
	 *
	 */
	setupMap() {

		var zoomLevel = this.getZoomLevel()
		this.map.setView([37.6, -95.665], zoomLevel)
		this.map.scrollWheelZoom.disable()
		// add control convenience methods

		_.extend(this.map, controlHelpers)

		this.map.ignoreNextClick = false
		// do not register a map item click event if it is fired due to a map drag end

		this.map.on('dragstart', (e) => { 
			this.props.setUiState({ isMapDragged: true })
		})

		this.map.on('dragend', (e) => {
			var items
			this.props.setUiState({ isMapDragged: false })
			// use functionality only if there is sufficient drag
			//   as Leaflet sometimes detects slightly imperfect clicks as drags
			items = this.props.project.get('data').items
			if (e.distance > 15 && items.hovered) {
				this.map.ignoreNextClick = true
			}
		})

		return this

	}

			
	/*
	 * Return map options.
	 * @returns {object} options
	 */
	getMapOptions() {
		return {
			attributionControl: true,
			zoomControl: false,
			inertia: false
		}
	}


	/*
	 * Render view.
	 *
	 */
	render() {
		L.mapbox.accessToken = 'pk.eyJ1Ijoicm9zc3ZhbmRlcmxpbmRlIiwiYSI6ImRxc0hRR28ifQ.XwCYSPHrGbRvofTV-CIUqw'
		this.map = L.mapbox.map(this.elId, 'rossvanderlinde.874ab107', this.getMapOptions())
		this.props.setMap(this.map)
		this.setupMap()
		this.hideAttribution()
		return this
	}


	/*
	 * Hide attribution view.
	 *
	 */
	hideAttribution() {
		$('.leaflet-control-attribution').hide()
	}


	/*
	 * Destroy view. Clear Leaflet-specific event listeners.
	 *
	 */
	destroy() {
		if (!this.map) { return }
		this.map.clearAllEventListeners()
		this.map.remove()
		return this
	}

}

export default RootView