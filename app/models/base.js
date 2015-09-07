import * as Backbone from 'backbone';
import * as _ from 'underscore';
import $ from 'jquery';
import marked from 'marked';

var Model = Backbone.Model.extend({

	/** 
	 * Recognize and process data.
	 * @param {object} data - Data as key-value pairs.
	 * @returns {object} data - Modified data.
	 */
	parse: function(data) {
		data = this._adaptMongoId(data);
		return data;
	},

	/*
	 * Custom get function, accommodating a suffix, e.g. status_2012.
	 * @param {string} field - Same as in Backbone.
	 * @param {string} suffix - Custom suffix.
	 * @returns {} value
	 */
	get: function(field, suffix) {
		var getFnc = Backbone.Model.prototype.get;
		if (suffix == null) { return getFnc.apply(this, [ field ]); }
		return getFnc.apply(this, [ field + '_' + suffix ]);
	},

	/**
	 * Adds fields of a foreign collection, referenced by a foreign id within the model.
	 * @param {string} foreignIdKey - Foreign id key, of the format 'model_id' or 'model_ids'.
	 *                                  the former references a single value, the latter an array.
	 * @param {object} foreignCollection
	 * @param {string} fieldKey - The field of the foreign model to be copied in, e.g. 'name'.
	 * @returns {object} this - The model instance, with 'model_name' field added.
	 */
	addForeignField: function(foreignIdKey, foreignCollection, fieldKey) {

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

	},
	
	/**
	 * Finds and replaces key.
	 * @param {object} data - Data as key-value pairs.
	 * @param {string} standardKey
	 * @param {array} keyFormatList - List of possible keys, e.g. [latitude, lat, Latitude] for latitude.
	 * @returns {boolean} found - Whether the key is found in the data.
	 */
	_findAndReplaceKey: function(data, standardKey, keyFormatList) {
		var found, i, kf, len;
		found = false;
		if (keyFormatList == null) {
			keyFormatList = [standardKey]; 
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
	},

	/**
	 * Adapts Mongoid ID.
	 * @param {object} data - Data as key-value pairs.
	 * @returns {object} data - Modified data.
	 */
	_adaptMongoId: function(data) {
		if ((data._id != null)) {
			if ((data._id.$oid != null)) {
				data.id = String(data._id.$oid);
			} else {
				data.id = String(data._id);
			}
			delete data._id;
		} else if ((data.id != null) && (data.id.$oid != null)) {
			data.id = String(data.id.$oid);
		}
		return data;
	},

	/**
	 * Remove the array wrapper, if response is one-member array.
	 * @param {object} resp - Server resonse.
	 * @returns {object} resp - Modified response.
	 */
	_removeArrayWrapper: function(resp) {
		if (_.isArray(resp) && (resp.length === 1)) {
			resp = resp[0];
		}
		return resp;
	},

	/**
	 * Remove all line breaks from field.
	 * @param {object} resp - Server response.
	 * @param {string} key - Response key.
	 * @returns {object} resp - Modified response.
	 */
	_removeLineBreaks: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
		}
		return resp;
	},

	/**
	 * Removes all spaces from field.
	 * @param {object} resp - Server response.
	 * @param {string} key - Response key.
	 * @returns {object} resp - Modified response.
	 */
	_removeSpaces: function(resp, key) {
		if (resp[key] != null) {
			resp[key] = resp[key].replace(/\s+/g, '');
		}
		return resp;
	},

	/**
	 * Process static html on a key.
	 * @param {object} resp - Server response.
	 * @param {string} key
	 * @returns {object} resp - Modified response.
	 */
	_processStaticHtml: function(resp, key) {
		var $html, html, newHtml;
		html = resp[key];
		$html = $(html);
		$html.find('a').attr('target', '_blank');
		newHtml = $('<div></div>').append($html.clone()).html();
		resp[key] = newHtml;
		return resp;
	},

	/**
	 * Get markdown html.
	 * @param {string} key
	 * @returns {} newHtml
	 */
	getMarkdownHtml: function(key) {
		var $html, md, newHtml;
		md = this.get(key);
		if (md != null) {
			$html = $(marked(md));
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			return newHtml;
		}
	},


	/**
	 * Set table of contents for html data under a given key.
	 * @param {string} key
	 * @param {string} saveKey - Key under which the modified html snippet is placed.
	 * @returns {object} this
	 */
	setHtmlToc: function(key, saveKey) {

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

});

var Collection = Backbone.Collection.extend({
	
	model: Model,

	buildQueryString: function(query) {

		var queryString = '?';

		if (query == null) { return ''; }

		for (let key in query) {
			let value = query[key];
			queryString += `${key}=${value}&`
		}

		queryString = queryString.slice(0, -1);

		return queryString;

	},

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

	},

	/**
	 * Recognize and process server response by applying the corresponding model's parse method.
	 * @param {object} resp - Server response.
	 * @returns {object} resp - Modified response.
	 */
	parse: function(resp) {
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

});

module.exports = {
	Model: Model,
	Collection: Collection
};