import * as Backbone from 'backbone';
import * as _ from 'underscore';
import $ from 'jquery';

var Model = Backbone.Model.extend({

	/*
	 * Returns a fetch promise. Project ID must be set for this to work.
	 *
	 */
	getClientFetchPromise: function() {

		return new Promise((resolve, reject) => {

			var url = this.apiUrlRoot + '/' + this.get('id');

			$.ajax({
				url: url,
				type: 'get',
				success: (datum) => {
					this.set(datum);
					resolve(this);
				},
				error: (err) => {
					reject(err);
				}
			});

		});

	},

	/*
	 * Returns save promise.
	 *
	 */
	getClientSavePromise: function() {

		return new Promise((resolve, reject) => {

			var url = this.apiUrlRoot + '/new';

			$.ajax({
				url: url,
				type: 'post',
				dataType: 'text',
				data: { jsonString: JSON.stringify(this.toJSON()) },
				success: (datum) => {
					resolve(datum);
				},
				error: (err) => {
					reject(err);
				}
			});

		});

	},

	/*
	 * Returns update promise.
	 *
	 */
	getClientUpdatePromise: function() {

		return new Promise((resolve, reject) => {

			var url = `${this.apiUrlRoot}/${this.get('id')}/edit`;

			$.ajax({
				url: url,
				type: 'post',
				dataType: 'text',
				data: { jsonString: JSON.stringify(this.toJSON()) },
				success: (datum) => {
					resolve(datum);
				},
				error: (err) => {
					reject(err);
				}
			});

		});

	},

	/*
	 * Returns delete promise.
	 *
	 */
	getClientDeletePromise: function() {

		return new Promise((resolve, reject) => {

			var url = `${this.apiUrlRoot}/${this.get('id')}`;

			$.ajax({
				url: url,
				type: 'delete',
				success: (datum) => {
					resolve(datum);
				},
				error: (err) => {
					reject(err);
				}
			});

		});

	}

});

var Collection = Backbone.Collection.extend({
	
	model: Model,

	// Fetch instances on the client.
	// TODO: customize to include a req object.
	getClientFetchPromise: function(query) {

		var isQueried = (query != null);

		return new Promise((resolve, reject) => {

			if (!isQueried) {

				// Small, seeded collections are resolved immediately.
				if (this.dbSeed) {
					this.reset(this.dbSeed);
					return resolve(this);
				}

				// Cached collections are resolved immediately.
				if (this.dbCache) {
					this.reset(this.dbCache);
					return resolve(this);
				}

			}

			var url = this.apiUrl + this.buildQueryString(query);

			$.ajax({
				url: url,
				type: 'get',
				success: (data) => {
					// Set database cache.
					if (!isQueried) { this.dbCache = data; }
					this.reset(data);
					resolve(this);
				},
				error: (err) => {
					reject(err);
				}
			});

		});

	}

});

export default {
	Model: Model,
	Collection: Collection
};