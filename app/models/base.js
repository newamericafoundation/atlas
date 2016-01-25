import Backbone from 'backbone'
import _ from 'underscore'
import $ from 'jquery'
import marked from 'marked'

import * as baseCrud from './base_crud.js'


/*
 *
 *
 */
export class Model extends baseCrud.Model {

	get resourceName() { return 'resource' }

	// Generic plural
	get resourceNamePlural() { return `${this.resourceName}s` }

	/*
	 * Custom get function, accommodating a suffix, e.g. status_2012.
	 * @param {string} field - Same as in Backbone.
	 * @param {string} suffix - Custom suffix.
	 * @returns {} value
	 */
	get(field, suffix) {
		var getMethod = Backbone.Model.prototype.get
		if (suffix == null) { return getMethod.apply(this, [ field ]) }
		return getMethod.apply(this, [ field + '_' + suffix ])
	}


	/*
	 *
	 *
	 */
	getUploadPath() {
		return `uploads/${this.resourceNamePlural}/`
	}


	/*
	 * Adds fields of a foreign collection, referenced by a foreign id within the model.
	 * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
	 *                                  the former references a single value, the latter an array.
	 * @param {object} foreignCollection
	 * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
	 * @returns {object} this - The model instance, with 'model_name' field added.
	 */
	addForeignField(foreignIdKey, foreignCollection, fieldKey) {

		// belongs_to relationship with a single reference id
		if (foreignIdKey.slice(-2) === 'id') {

			let newKey = foreignIdKey.slice(0, -2) + fieldKey
			let foreignModel = foreignCollection.findWhere({id: this.get(foreignIdKey)})
			this.set(newKey, foreignModel.get(fieldKey))

		// has_many relationship with id references embedded in an array field
		} else if (foreignIdKey.slice(-3) === 'ids') {

			let newKey = foreignIdKey.slice(0, -3) + fieldKey + 's'

			let foreignFields = []

			let foreignIds = this.get(foreignIdKey)

			foreignIds.forEach(function(foreignId) {
				// simple pluralization
				var foreignModel = foreignCollection.findWhere({id: foreignId})
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey))
				}
			})

			this.set(newKey, foreignFields)

		}

		return this

	}
	

	/**
	 * Finds and replaces key.
	 * @param {object} data - Data as key-value pairs.
	 * @param {string} standardKey
	 * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
	 * @returns {boolean} found - Whether the key is found in the data.
	 */
	findAndReplaceKey(data, standardKey, keyAliases) {
		var found = false
		if (keyAliases == null) { keyAliases = [ standardKey ] }
		for (let keyAlias in keyAliases) {
			if (data[keyAlias]) {
				found = true
				if (keyAlias !== standardKey) {
					data[standardKey] = data[keyAlias]
					delete data[keyAlias]
				}
			}
		}
		return found
	}


	/*
	 * Set table of contents for html data under a given key.
	 * @param {string} key
	 * @param {string} saveKey - Key under which the modified html snippet is placed.
	 * @returns {object} this
	 */
	setHtmlToc(key, saveKey) {

		saveKey = saveKey || key

		var html = this.get(key)

		if (html == null) { return }

		var arr = []

		var $containedHtml = $('<div></div>').append($(html))

		$containedHtml.children().each(function() {

			var $el = $(this)
			var tagName = $el.prop('tagName')
			var content = $el.html()
			var tocId = content.replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase()

			if (tagName.toLowerCase == null) { return; } 
			tagName = tagName.toLowerCase(); 

			if (['h1', 'h2'].indexOf(tagName) > -1) {
				$(`<span id='toc-${tocId}'></span>`).insertBefore($el)
				arr.push({
					id: tocId,
					tagName: tagName,
					content: content 
				})
			}

		})

		this.set(saveKey, $containedHtml.html())
		this.set(saveKey + '_toc', arr)

	}

}



/*
 *
 *
 */
export class Collection extends baseCrud.Collection {
	
	get model() { return Model }


	/**
	 * Recognize and process server response by applying the corresponding model's parse method.
	 * @param {object} resp - Server response.
	 * @returns {object} resp - Modified response.
	 */
	parse(resp) {
		var model = new this.model()
		var modelParseMethod = model.parse.bind(model)
		if (!modelParseMethod) { return resp }
		return resp.map(item => modelParseMethod(item))
	}

}