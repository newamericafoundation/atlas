var Backbone = require('backbone'),
	_ = require('underscore'),
	$ = require('jquery');

exports.Model = Backbone.Model.extend({
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
		_adaptMongoId: function(data) {
			if ((data._id != null)) {
				if ((data._id.$oid != null)) {
					data.id = String(data._id.$oid);
				} else {
					data.id = data._id;
				}
				delete data._id;
			} else if ((data.id != null) && (data.id.$oid != null)) {
				data.id = String(data.id.$oid);
			}
			return data;
		},
		_removeArrayWrapper: function(resp) {
			if (_.isArray(resp) && (resp.length === 1)) {
				resp = resp[0];
			}
			return resp;
		},
		_removeLineBreaks: function(resp, key) {
			if (resp[key] != null) {
				resp[key] = resp[key].replace(/(\r\n|\n|\r)/gm, '');
			}
			return resp;
		},
		_removeSpaces: function(resp, key) {
			if (resp[key] != null) {
				resp[key] = resp[key].replace(/\s+/g, '');
			}
			return resp;
		},
		_processStaticHtml: function(resp, key) {
			var $html, html, newHtml;
			html = resp[key];
			$html = $(html);
			$html.find('a').attr('target', '_blank');
			newHtml = $('<div></div>').append($html.clone()).html();
			resp[key] = newHtml;
			return resp;
		},
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
	model: exports.Model
});