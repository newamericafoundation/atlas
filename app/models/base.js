var Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery');

exports.Model = Backbone.Model.extend({

	/** 
	 * Recognize and process data.
	 * @param {object} data - Data as key-value pairs.
	 * @returns {object} data - Modified data.
	 */
	parse: function(data) {
		data = this._adaptMongoId(data);
		return data;
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
			foreignModel, foreignIds, foreignId,
			singleForeignIdKey, // if foreignIdKey holds an array
			foreignFields = [],
			i, max;

		if (foreignIdKey.slice(-2) === 'id') {
			newKey = foreignIdKey.slice(0, -2) + fieldKey;
			foreignModel = foreignCollection.findWhere({id: this.get(foreignIdKey)});
			this.set(newKey, foreignModel.get(fieldKey));
		} else if (foreignIdKey.slice(-3) === 'ids') {
			foreignIds = this.get(foreignIdKey);
			for(i = 0, max = foreignIds.length; i < max; i += 1) {
				foreignId = foreignIds[i];
				// simple pluralization
				newKey = foreignIdKey.slice(0, -3) + fieldKey + 's';
				foreignModel = foreignCollection.findWhere({id: foreignId});
				if (foreignModel != null) {
					foreignFields.push(foreignModel.get(fieldKey));
				}
			}
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
	 * @param {string} key - Response key.
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
	 * @param {string} key - 
	 * @returns {} newHtml - 
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
	}

});

exports.Collection = Backbone.Collection.extend({
	model: exports.Model,

	/**
	 * Recognize and process server response.
	 * @param {object} resp - Server response.
	 * @returns {object} resp - Modified response.
	 */
	parse: function(resp) {
		var i, max,
			item;
		if (exports.Model.prototype.parse == null) { return resp; }
		for (i = 0, max = resp.length; i < max; i += 1) {
			item = resp[i];
			resp[i] = exports.Model.prototype.parse(item);
		}
		return resp;
	}

});