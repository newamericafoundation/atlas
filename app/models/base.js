import * as Backbone from 'backbone';
import * as _ from 'underscore';
import $ from 'jquery';
import marked from 'marked';
import baseCrud from './base_crud.js';



/*
 *
 *
 */
class Model extends baseCrud.Model {

	/*
	 * Lower-case name of the resource constructed by this constructor.
	 *
	 */
	get resourceName() { return 'resource'; }


	get apiUrlRoot() {
		var name = this.resourceName;
		return `/api/v1/${name}s`; 
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
		return `/${name}s/${this.get('id')}/edit`;
	}


	/*
	 * Custom get function, accommodating a suffix, e.g. status_2012.
	 * @param {string} field - Same as in Backbone.
	 * @param {string} suffix - Custom suffix.
	 * @returns {} value
	 */
	get(field, suffix) {
		var getFnc = Backbone.Model.prototype.get;
		if (suffix == null) { return getFnc.apply(this, [ field ]); }
		return getFnc.apply(this, [ field + '_' + suffix ]);
	}


	/**
	 * Adds fields of a foreign collection, referenced by a foreign id within the model.
	 * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
	 *                                  the former references a single value, the latter an array.
	 * @param {object} foreignCollection
	 * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
	 * @returns {object} this - The model instance, with 'model_name' field added.
	 */
	addForeignField(foreignIdKey, foreignCollection, fieldKey) {

		var newKey, 
			foreignModel, foreignIds,
			singleForeignIdKey, // if foreignIdKey holds an array
			foreignFields = [];

		// belongs_to relationship with a single reference id
		if (foreignIdKey.slice(-2) === 'id') {

			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({id: this.get(foreignIdKey)});
			this.set(newKey, foreignModel.get(fieldKey));

		// has_many relationship with id references embedded in an array field
		} else if (foreignIdKey.slice(-3) === 'ids') {

			foreignIds = this.get(foreignIdKey);

			foreignIds.forEach(function(foreignId) {
				// simple pluralization
				newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
				foreignModel = foreignCollection.findWhere({id: foreignId});
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey));
				}
			});

			this.set(newKey, foreignFields);

		}

		return this;

	}
	

	/**
	 * Finds and replaces key.
	 * @param {object} data - Data as key-value pairs.
	 * @param {string} standardKey
	 * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
	 * @returns {boolean} found - Whether the key is found in the data.
	 */
	findAndReplaceKey(data, standardKey, keyFormatList) {
		var found, i, kf, len;
		found = false;
		if (keyFormatList == null) {
			keyFormatList = [ standardKey ]; 
		}
		for (i = 0, len = keyFormatList.length; i < len; i++) {
			kf = keyFormatList[i];
			if (data[kf]) {
				found = true;
				if (kf !== standardKey) {
					data[standardKey] = data[kf];
					delete data[kf];
				}
			}
		}
		return found;
	}


	/**
	 * Get markdown html.
	 * @param {string} key
	 * @returns {} newHtml
	 */
	getMarkdownHtml(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	}


	/**
	 * Set table of contents for html data under a given key.
	 * @param {string} key
	 * @param {string} saveKey - Key under which the modified html snippet is placed.
	 * @returns {object} this
	 */
	setHtmlToc(key, saveKey) {

		var html, $containedHtml, arr;

		saveKey = saveKey || key;

		html = this.get(key);
		if (html == null) { return; }

		arr = [];

		$containedHtml = $('<div></div>').append($(html));

		$containedHtml.children().each(function() {

			var $el = $(this),
				tagName = $el.prop('tagName'),
				content = $el.html(),
				tocId = content.replace(/[^a-z0-9]/ig, ' ').replace(/\s+/g, '-').toLowerCase();

			if (tagName.toLowerCase == null) { return; } 
			tagName = tagName.toLowerCase(); 

			if (['h1', 'h2'].indexOf(tagName) > -1) {
				$('<span id="toc-' + tocId + '"></span>').insertBefore($el);
				arr.push({
					id: tocId,
					tagName: tagName,
					content: content 
				});
			}

		});

		this.set(saveKey, $containedHtml.html());
		this.set(saveKey + '_toc', arr);

	}

}



/*
 *
 *
 */
class Collection extends baseCrud.Collection {
	
	get model() { return Model; }

	get dbCollection() { 
		var name = this.model.prototype.resourceName;
		return `${name}s`; 
	}

	get apiUrl() {
		var name = this.model.prototype.resourceName;
		return `/api/v1/${name}s`; 
	}

	/**
	 * Recognize and process server response by applying the corresponding model's parse method.
	 * @param {object} resp - Server response.
	 * @returns {object} resp - Modified response.
	 */
	parse(resp) {
		var i, max,
			item;
		var model = new this.model(),
			modelParseMethod = model.parse.bind(model);
		if (modelParseMethod == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = modelParseMethod(item);
		}
		return resp;
	}

}

export default {
	Model: Model,
	Collection: Collection
}