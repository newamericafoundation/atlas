import * as Backbone from 'backbone'
import * as _ from 'underscore'
import $ from 'jquery'

/*
 *
 *
 */
export class Model extends Backbone.Model {

	/*
	 * Lower-case name of the resource constructed by this constructor.
	 *
	 */
	get resourceName() { return 'resource' }


	/*
	 *
	 *
	 */
	get apiUrlRoot() {
		var name = this.resourceName;
		return `/api/v1/${name}s`; 
	}


	/*
	 *
	 *
	 */
	getIndexUrl() {
		var name = this.resourceName;
		return `/${name}s`;
	}


	/*
	 * Customize on subclass if route is non-standard or the resource has a custom plural name.
	 * 
	 */
	getViewUrl() {
		var name = this.resourceName;
		return `/${name}s/${this.get('id')}`;
	}


	/*
	 * Customize on subclass if route is non-standard or the resource has a custom plural name.
	 * 
	 */
	getEditUrl() {
		var name = this.resourceName;
		return `/admin/${name}s/${this.get('id')}/edit`;
	}


	/*
	 * Customize on subclass if route is non-standard or the resource has a custom plural name.
	 * 
	 */
	getDeleteUrl() {
		var name = this.resourceName;
		return `/admin/${name}s/${this.get('id')}/delete`;
	}


	/*
	 *
	 *
	 */
	getNewUrl() {
		var name = this.resourceName;
		return `/admin/${name}s/new`;
	}


	/*
	 * Returns a fetch promise. Project ID must be set for this to work.
	 *
	 */
	getClientFetchPromise() {

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

	}


	/*
	 * Returns save promise.
	 *
	 */
	getClientSavePromise() {

		return new Promise((resolve, reject) => {

			var url = this.apiUrlRoot

			$.ajax({
				url: url,
				type: 'post',
				dataType: 'text',
				data: { jsonString: JSON.stringify(this.toJSON()) },
				success: (datum) => {
					resolve(datum);
				},
				error: (err) => { reject(err) }
			})

		})

	}


	/*
	 * Returns update promise.
	 *
	 */
	getClientUpdatePromise() {

		return new Promise((resolve, reject) => {

			var url = `${this.apiUrlRoot}/${this.get('id')}/edit`

			$.ajax({
				url: url,
				type: 'put',
				dataType: 'text',
				data: { jsonString: JSON.stringify(this.toJSON()) },
				success: (datum) => { resolve(datum) },
				error: (err) => { reject(err) }
			})

		})

	}


	/*
	 * Returns delete promise.
	 *
	 */
	getClientDeletePromise() {

		return new Promise((resolve, reject) => {

			var url = `${this.apiUrlRoot}/${this.get('id')}`

			$.ajax({
				url: url,
				type: 'delete',
				success: (datum) => { resolve(datum) },
				error: (err) => { reject(err) }
			})

		})

	}

}



/*
 *
 *
 */
export class Collection extends Backbone.Collection {
	
	get model() { return Model; }


	/*
	 *
	 *
	 */
	get dbCollectionName() { 
		var name = this.model.prototype.resourceName
		return `${name}s`
	}


	/*
	 *
	 *
	 */
	get apiUrl() {
		var name = this.model.prototype.resourceName
		return `/api/v1/${name}s`
	}


	/*
	 *
	 *
	 */
	buildQueryString(query) {

		var queryString = ''

		if (query == null || Object.keys(query).length === 0) { return null }

		for (let key in query) {
			let value = query[key]
			queryString += `${key}=${value}&`
		}

		return queryString.slice(0, -1)

	}


	/*
	 *
	 *
	 */
	buildFieldString(fields) {

		if (!fields) { return }

		var keys = Object.keys(fields)

		if (keys.length === 0) { return null }

		var fieldString = 'fields=' + keys.map((key) => `${ fields[key] === 1 ? '' : '-' }${key}`).join(',')

		return fieldString

	}


	/*
	 * Fetch instances on the client.
	 *
	 */
	getClientFetchPromise(query, fields) {

		var isCompleteQuery = (query != null && fields == null)

		var queryString = '?' + (this.buildQueryString(query) || '') + '&' + (this.buildFieldString(fields) || '')

		return new Promise((resolve, reject) => {

			if (!isCompleteQuery) {

				// Small, seeded collections are resolved immediately.
				if (this.dbSeed) {
					this.reset(this.dbSeed)
					return resolve(this)
				}

				// Cached collections are resolved immediately.
				if (this.dbCache) {
					this.reset(this.dbCache)
					return resolve(this)
				}

			}

			var url = this.apiUrl + queryString

			$.ajax({
				url: url,
				type: 'get',
				success: (data) => {
					// Set database cache.
					if (!isCompleteQuery) { this.dbCache = data }
					this.reset(data)
					resolve(this)
				},
				error: (err) => { reject(err) }
			})

		})

	}

}