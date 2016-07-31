// Model used to handle geo shape files, from download and geojson conversion to fetching once the app is running.
import _ from 'underscore'
import $ from 'jquery'
import topojson from 'topojson'

import * as base from './base.js'
import seed from './../../db/seeds/shape_files.json'

export class Model extends base.Model {
	
	/*
	 * Return promise resolved when GeoJson file is fetched and assembled from TopoJson.
	 *
	 */
	getGeoJsonFetchPromise() {

		// Store cache for geoJson data on the constructor.
		Model.geoJsonCache = Model.geoJsonCache || {}

		return new Promise((resolve, reject) => {

			var name = this.get('name')
			var url = `/data/${name}.json`

			// Resolve immediately if found on cache.
			if (Model.geoJsonCache[name]) {
				return resolve(Model.geoJsonCache[name]);
			}

			$.ajax({
				type: 'get',
				url: url,
				success: (data) => {
					if (data.objects == null) { data = JSON.parse(data) }
					var geoJson = topojson.feature(data, data.objects[this.get('fileName')])
					// Set on cache.
					Model.geoJsonCache[name] = geoJson
					return resolve(geoJson)
				},
				error: (err) => {
					return reject(err)
				}
			})

		})

	}


	/*
	 * Used by topojson converter through gulp.
	 *
	 */
	getRenameParam() {
		var props = this.get('properties')
		return Object.keys(props).map((key) => {
			var value = props[key]
			return `${key}=${value}`
		}).join(',')
	}

}

export class Collection extends base.Collection {

	get model() { return Model }
	initialize() { this.reset(seed) }

}