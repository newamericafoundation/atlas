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

	buildQueryString: function(query) {

		var queryString = '';

		if (query == null || Object.keys(query).length === 0) { return null; }

		for (let key in query) {
			let value = query[key];
			queryString += `${key}=${value}&`
		}

		return queryString.slice(0, -1);

	},

	buildFieldString: function(fields) {

		var fieldString = 'fields=';

		if (fields == null || Object.keys(fields).length === 0) { return null; }

		for (let key in fields) {
			let value = fields[key];
			fieldString += `${ value === 1 ? '' : '-' }${key},`;
		}

		return fieldString.slice(0, -1);

	},

	// Fetch instances on the client.
	// TODO: customize to include a req object.
	getClientFetchPromise: function(query, fields) {

		var isCompleteQuery = (query != null && fields == null);

		var queryString = '?' + (this.buildQueryString(query) || '') + '&' + (this.buildFieldString(fields) || '');

		return new Promise((resolve, reject) => {

			if (!isCompleteQuery) {

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

			var url = this.apiUrl + queryString;

			$.ajax({
				url: url,
				type: 'get',
				success: (data) => {
					// Set database cache.
					if (!isCompleteQuery) { this.dbCache = data; }
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