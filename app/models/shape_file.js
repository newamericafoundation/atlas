// Model used to handle geo shape files, from download and geojson conversion to fetching once the app is running.

import _ from 'underscore';
import base from './base.js';
import seed from './../../db/seeds/shape_files.json';
import $ from 'jquery';
import topojson from 'topojson';

var Model = base.Model.extend({
	
	getClientFetchPromise: function() {

		return new Promise((resolve, reject) => {

			$.ajax({
				type: 'get',
				url: `/data/${this.get('name')}.json`,
				success: (data) => {
					var geoJson = topojson.feature(data, data.objects[this.get('fileName')]);
					return resolve(geoJson);
				},
				error: (err) => {
					return reject(err);
				}
			});

		});

	},

	// Used by topojson converter through gulp.
	getRenameParam: function() {
		var props = this.get('properties');
		return Object.keys(props).map((key) => {
			var value = props[key];
			return `${key}=${value}`;
		}).join(',');
	}

});

var Collection = base.Collection.extend({

	dbSeed: seed,

	model: Model,

	apiUrl: '/api/v1/project_sections',

	hasSingleActiveChild: false,

	initializeActiveStatesOnReset: true,

	initialize: function() {
		this.reset(seed);
	}

});

export default {
	Model: Model,
	Collection: Collection
};